import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import {invariant} from "@onflow/util-invariant"
import {tx} from "src/flow/util/tx"

const CODE = fcl.cdc`
  import NFTStorefront from 0xNFTStorefront

  transaction(listingResourceID: UInt64) {
    let storefront: &NFTStorefront.Storefront{NFTStorefront.StorefrontManager}

    prepare(acct: AuthAccount) {
      self.storefront = acct.borrow<&NFTStorefront.Storefront{NFTStorefront.StorefrontManager}>(from: NFTStorefront.StorefrontStoragePath)
        ?? panic("Missing or mis-typed NFTStorefront.Storefront")
    }

    execute {
      self.storefront.removeListing(listingResourceID: listingResourceID)
    }
  }
`

// prettier-ignore
export function removeListing({listingResourceID}, opts = {}) {
  invariant(
    listingResourceID != null,
    "cancelMarketListing({listingResourceID}) -- listingResourceID required"
  )

  return tx(
    [
      fcl.transaction(CODE),
      fcl.args([fcl.arg(Number(listingResourceID), t.UInt64)]),
      fcl.proposer(fcl.authz),
      fcl.payer(fcl.authz),
      fcl.authorizations([fcl.authz]),
      fcl.limit(1000),
    ],
    opts
  )
}
