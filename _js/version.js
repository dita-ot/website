function parse(value) {
  const op = value.replace(/\./g, '').replace(/[^=<>.]/g, '')
  const v = value.replace(/[=<>]/g, '')
  const tokens = v.split('.').map(v => Number.parseInt(v))
  if (tokens.length < 3) {
    for (let i = tokens.length; i < 3; i++) {
      tokens.push(0)
    }
  }
  return {
    op: !!op ? op : null,
    tokens: tokens
  }
}
function compare(a = 0, b = 0) {
  if (a === b) {
    return 0
  } else if (a < b) {
    return 1
  } else {
    return -1
  }
}
function zip(as, bs) {
  return as.map(function(e, i) {
    return [e, bs[i]]
  })
}

export function compareVersion(a, b) {
  try {
    const as = parse(a)
    const bs = parse(b)
    const comparedPairs = zip(as.tokens, bs.tokens).map(pair => compare(pair[0], pair[1]))
    return verify(comparedPairs)
  } catch (e) {
    return 0
  }
}

function verify(pairs, op) {
  const reduced = pairs.reduce((acc, curr) => (acc !== 0 ? acc : curr), 0)
  if (op === '>=') {
    return reduced <= 0
  } else if (op === '>') {
    return reduced < 0
  } else if (op === '<=') {
    return reduced >= 0
  } else if (op === '<') {
    return reduced > 0
  } else {
    return reduced === 0
  }
}

export function matchVersion(a, b) {
  try {
    const as = parse(a)
    const bs = parse(b)
    const comparedPairs = zip(as.tokens, bs.tokens).map(pair => compare(pair[0], pair[1]))
    return verify(comparedPairs, bs.op)
  } catch (e) {
    return false
  }
}
