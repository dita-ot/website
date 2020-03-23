interface Version {
  op: '>=' | '>' | '<=' | '<' | '='
  tokens: number[]
}

function parse(value: string): Version {
  const op = value.replace(/\./g, '').replace(/[^=<>.]/g, '') || '='
  const v = value.replace(/[=<>]/g, '')
  const tokens = v.split('.').map((v) => Number.parseInt(v))
  if (tokens.length < 3) {
    for (let i = tokens.length; i < 3; i++) {
      tokens.push(0)
    }
  }
  tokens.forEach((token) => {
    if (Number.isNaN(token)) {
      throw new Error()
    }
  })
  if (!(op === '<' || op === '<=' || op === '>' || op === '>=' || op === '=')) {
    throw new Error()
  }
  return { op, tokens }
}
function compare(a: number = 0, b: number = 0): number {
  if (a === b) {
    return 0
  } else if (a < b) {
    return 1
  } else {
    return -1
  }
}
function zip(as: number[], bs: number[]): number[][] {
  return as.map(function (e, i) {
    return [e, bs[i]]
  })
}

export function compareVersion(a: string, b: string): number {
  try {
    const as = parse(a)
    const bs = parse(b)
    const comparedPairs = comparePairs(as, bs)
    return reduceComparisons(comparedPairs)
  } catch (e) {
    return 0
  }
}

function comparePairs(as: Version, bs: Version) {
  return zip(as.tokens, bs.tokens).map((pair) => compare(pair[0], pair[1]))
}

function reduceComparisons(pairs: number[]): number {
  return pairs.reduce((acc, curr) => (acc !== 0 ? acc : curr), 0)
}

function verify(pairs: number[], op?: string): boolean {
  const reduced = reduceComparisons(pairs)
  if (op === '>=') {
    return reduced <= 0
  } else if (op === '>') {
    return reduced < 0
  } else if (op === '<=') {
    return reduced >= 0
  } else if (op === '<') {
    return reduced > 0
  } else if (op === '=') {
    return reduced === 0
  } else {
    throw new Error()
  }
}

export function matchVersion(a: string, b: string): boolean {
  try {
    const as = parse(a)
    const bs = parse(b)
    const comparedPairs = comparePairs(as, bs)
    return verify(comparedPairs, bs.op)
  } catch (e) {
    return false
  }
}
