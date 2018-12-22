const TRANSLATIONS = {
  INSTALL_OLD: 'DITA-OT 3.1 and older',
  INSTALL_CURRENT: 'DITA-OT 3.2 and newer',
  LICENSE: 'License',
  HOMEPAGE: 'Homepage',
  KEYWORDS: 'Keywords',
  INSTALL: 'Install',
  FILTER_PLACEHOLDER: 'Filter plugins',
  FILTER_ANY_VERSION: 'Any version',
  FILTER_VERSION_LABEL: 'DITA-OT version',
  NO_MATCHES: 'No matches found.',
  DEPENDENCIES: 'Dependencies',
  VERSIONS: 'Versions',
  VERSION_NOT_FOUND: 'Plugin {} version {} not found.',
  NOT_FOUND: 'Plugin {} not found.',
  FOUND: 'Found {} matches.'
}

export default function t(name) {
  if (arguments.length > 1) {
    return [...arguments]
      .slice(1)
      .reduce((acc, curr) => acc.replace('{}', curr), TRANSLATIONS[name])
  } else {
    return TRANSLATIONS[name]
  }
}
