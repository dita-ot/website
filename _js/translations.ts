const TRANSLATIONS: { [key: string]: string } = {
  INSTALL_3_1: 'DITA-OT 3.1 and older',
  INSTALL_3_2: 'DITA-OT 3.2–3.4',
  INSTALL_3_5: 'DITA-OT 3.5 and newer',
  LICENSE: 'License',
  HOMEPAGE: 'Homepage',
  KEYWORDS: 'Keywords',
  INSTALL: 'Install',
  FILTER_PLACEHOLDER: 'Filter plug-ins',
  FILTER_ANY_VERSION: 'Any version',
  FILTER_VERSION_LABEL: 'DITA-OT version',
  NO_MATCHES: 'No matches found.',
  DEPENDENCIES: 'Dependencies',
  VERSIONS: 'Versions',
  VERSION_NOT_FOUND: 'Plug-in {} version {} not found.',
  NOT_FOUND: 'Plug-in {} not found.',
  FOUND: 'Found {} matches.',
  FILE_HISTORY: 'File history',
  FILE_HISTORY__TITLE: 'Show the list of changes to the source file on GitHub.',
  EDIT: 'Edit this page',
  EDIT__TITLE: 'Edit this page on GitHub to help improve the docs',
  linux: 'Linux',
  mac: 'macOS',
  windows: 'Windows',
}

export default function t(name: string): string {
  if (arguments.length > 1) {
    return skip(arguments).reduce((acc, curr) => acc.replace('{}', curr), TRANSLATIONS[name])
  } else {
    return TRANSLATIONS[name]
  }
}

/**
 * Skip first argument.
 *
 * Preferred option would be Array.from(arguments).slice(1) but that requires polyfill
 */
function skip(args: IArguments): any[] {
  const res = []
  for (let i = 1; i < args.length; i++) {
    res.push(args[i])
  }
  return res
}
