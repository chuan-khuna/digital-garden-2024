/**
 * Loaders for versioned resume content (see docs/adr/0001-versioned-resume-collections.md).
 *
 * Resume content lives in `src/content/resume/<version>/`, where `index` is the
 * Default Version. Every resume collection spans all version folders; each entry
 * is tagged with the `version` it came from and gets an id of `<version>/<id>`
 * so ids stay unique across versions.
 */
import { existsSync, promises as fs } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { glob, type Loader, type LoaderContext } from 'astro/loaders'

/** Content root holding one folder per Resume Version. */
export const RESUME_CONTENT_BASE = 'src/content/resume'

/** Folder name of the Default Version. Reserved: never used as a version route. */
export const DEFAULT_RESUME_VERSION = 'index'

/** Lowercase kebab-case, URL-safe slug, e.g. `2026-jul-dev`. */
const RESUME_VERSION_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/**
 * Throws a descriptive error (failing the build) if `version` is not a valid
 * Resume Version folder name.
 */
export function assertValidResumeVersion(version: string): void {
  if (version === DEFAULT_RESUME_VERSION) return
  if (!RESUME_VERSION_PATTERN.test(version)) {
    throw new Error(
      `[resume] Invalid Resume Version folder "${RESUME_CONTENT_BASE}/${version}/". ` +
        `Version names must be lowercase kebab-case slugs (a-z, 0-9, single hyphens), e.g. "2026-jul-dev". ` +
        `"${DEFAULT_RESUME_VERSION}" is reserved for the Default Version.`,
    )
  }
}

/** Split an id/path like `2026-jul-dev/experiences/foo.md` into its version folder. */
function versionFromPath(path: string): string {
  const version = path.replace(/\\/g, '/').split('/')[0]
  assertValidResumeVersion(version)
  return version
}

/**
 * Markdown loader spanning every version folder: reads
 * `src/content/resume/* /<section>/*.md` and injects `version` into the entry data.
 * Wraps Astro's `glob()` so rendering, digests and dev file watching keep working.
 */
export function versionedResumeGlob(section: string): Loader {
  const inner = glob({
    pattern: `*/${section}/*.md`,
    base: RESUME_CONTENT_BASE,
    generateId: ({ entry }) => {
      const version = versionFromPath(entry)
      const fileName = entry.split('/').at(-1)!.replace(/\.md$/, '')
      return `${version}/${fileName}`
    },
  })

  return {
    name: `resume-versioned-glob:${section}`,
    load: (context) =>
      inner.load({
        ...context,
        parseData: (props) =>
          context.parseData({
            ...props,
            data: { ...props.data, version: versionFromPath(props.id) },
          }),
      } as LoaderContext),
  }
}

interface VersionedJsonOptions {
  /** Only read the Default Version's file; files in other versions are ignored. */
  defaultVersionOnly?: boolean
}

/**
 * JSON loader spanning every version folder: reads
 * `src/content/resume/* /<fileName>` (a JSON array whose items carry an `id`),
 * stores each item as `<version>/<id>` with `version` injected into its data.
 * Replaces `file()`, which can only read a single file.
 */
export function versionedResumeJson(
  fileName: string,
  options: VersionedJsonOptions = {},
): Loader {
  return {
    name: `resume-versioned-json:${fileName}`,
    load: async (context) => {
      const { config, logger, parseData, store, watcher } = context
      const basePath = fileURLToPath(
        new URL(`${RESUME_CONTENT_BASE}/`, config.root),
      )

      async function listVersions(): Promise<string[]> {
        if (options.defaultVersionOnly) return [DEFAULT_RESUME_VERSION]
        if (!existsSync(basePath)) return []
        const dirents = await fs.readdir(basePath, { withFileTypes: true })
        return dirents.filter((d) => d.isDirectory()).map((d) => d.name)
      }

      async function sync() {
        store.clear()
        for (const version of await listVersions()) {
          assertValidResumeVersion(version)
          const filePath = join(basePath, version, fileName)
          if (!existsSync(filePath)) continue

          let items: unknown
          try {
            items = JSON.parse(await fs.readFile(filePath, 'utf-8'))
          } catch (error) {
            throw new Error(
              `[resume] Could not parse ${RESUME_CONTENT_BASE}/${version}/${fileName}: ${(error as Error).message}`,
            )
          }
          if (!Array.isArray(items)) {
            throw new Error(
              `[resume] ${RESUME_CONTENT_BASE}/${version}/${fileName} must contain a JSON array.`,
            )
          }

          const relativeFilePath = relative(
            fileURLToPath(config.root),
            filePath,
          ).replace(/\\/g, '/')

          for (const rawItem of items as Record<string, unknown>[]) {
            const rawId = (rawItem.id ?? rawItem.slug)?.toString()
            if (!rawId) {
              logger.error(
                `Item in ${relativeFilePath} is missing an id or slug field.`,
              )
              continue
            }
            const id = `${version}/${rawId}`
            if (store.has(id)) {
              logger.warn(
                `Duplicate id "${rawId}" in ${relativeFilePath}. Later items overwrite earlier ones.`,
              )
            }
            const data = await parseData({
              id,
              data: { ...rawItem, version },
              filePath,
            })
            store.set({ id, data, filePath: relativeFilePath })
          }
        }
      }

      await sync()

      if (!watcher) return
      watcher.add(basePath)
      const isWatchedFile = (changedPath: string) => {
        const parts = relative(basePath, changedPath)
          .replace(/\\/g, '/')
          .split('/')
        return (
          parts.length === 2 &&
          !parts[0].startsWith('..') &&
          parts[1] === fileName &&
          (!options.defaultVersionOnly || parts[0] === DEFAULT_RESUME_VERSION)
        )
      }
      const onChange = async (changedPath: string) => {
        if (!isWatchedFile(changedPath)) return
        logger.info(`Reloading resume data from ${fileName}`)
        try {
          await sync()
        } catch (error) {
          logger.error((error as Error).message)
        }
      }
      watcher.on('change', onChange)
      watcher.on('add', onChange)
      watcher.on('unlink', onChange)
    },
  }
}
