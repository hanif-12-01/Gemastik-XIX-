async function main() {
  const addrs = [
    '0xd338B2280AB7C054E00d0b78A6CB6D1d974d6b59',
    '0x87e1a06F71E43704729a450f5237A9436b7C3B90'
  ]

  for (const addr of addrs) {
    try {
      const url = `https://api-amoy.polygonscan.com/api?module=account&action=balance&address=${addr}&tag=latest`
      const res = await fetch(url)
      const data = await res.json()
      console.log(`Address: ${addr}`)
      console.log(`PolygonScan API result:`, JSON.stringify(data))
    } catch (e: any) {
      console.log(`PolygonScan fetch error: ${e.message}`)
    }
  }
}

main()
