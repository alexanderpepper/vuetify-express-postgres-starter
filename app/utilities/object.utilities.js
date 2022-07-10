exports.withoutNullsOrKeys = (obj, props) => Object.entries(obj).reduce((acc, [key, value]) =>
  value === null || (props && props.includes(key)) ? acc : ({ ...acc, [key]: value }), {})

exports.withoutKeys = (obj, props) => Object.entries(obj).reduce((acc, [key, value]) =>
  props.includes(key) ? acc : ({ ...acc, [key]: value }), {})
