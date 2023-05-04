import Base64 from './Base64.js'

function getPolicyEncode(policy) {
  const encodedPolicy = Base64.encode(JSON.stringify(policy));
  return encodedPolicy;
}

export default getPolicyEncode;