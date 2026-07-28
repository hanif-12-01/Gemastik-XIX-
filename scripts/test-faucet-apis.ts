const address = '0xd338B2280AB7C054E00d0b78A6CB6D1d974d6b59'

async function main() {
  console.log(`Attempting faucet requests for address: ${address}`)

  // 1. Polygon Faucet API
  try {
    const res = await fetch('https://faucet.polygon.technology/api/v1/claim', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      body: JSON.stringify({ network: 'amoy', address: address, token: 'maticToken' })
    })
    console.log(`Polygon Faucet Status: ${res.status}`)
    const text = await res.text()
    console.log(`Polygon Faucet Response: ${text.slice(0, 300)}`)
  } catch (e: any) {
    console.log(`Polygon Faucet error: ${e.message}`)
  }

  // 2. Chainlink Faucet status
  try {
    const res = await fetch(`https://faucets.chain.link/api/faucet-status?network=polygon-amoy`)
    console.log(`\nChainlink Faucet Status API: ${res.status}`)
    const text = await res.text()
    console.log(`Chainlink Response: ${text.slice(0, 300)}`)
  } catch (e: any) {
    console.log(`Chainlink Faucet error: ${e.message}`)
  }
}

main()
