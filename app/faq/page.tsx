import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FAQPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>What is StarkMarket?</AccordionTrigger>
            <AccordionContent>
              StarkMarket is a decentralized supermarket built on Starknet, a Layer 2 scaling solution for Ethereum. It
              allows you to purchase everyday items using cryptocurrency, with all transactions recorded on the
              blockchain.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>How do I connect my wallet?</AccordionTrigger>
            <AccordionContent>
              To connect your wallet, click on the "Connect Wallet" button in the top right corner of the page. You'll
              need a Starknet-compatible wallet like ArgentX or Braavos. If you don't have one, you'll need to install
              the browser extension and create a wallet first.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>What cryptocurrencies can I use?</AccordionTrigger>
            <AccordionContent>
              Currently, StarkMarket accepts ETH on the Starknet network. In the future, we plan to add support for
              other tokens and stablecoins.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>How are products delivered?</AccordionTrigger>
            <AccordionContent>
              After completing your purchase, you'll be asked to provide your delivery information. We partner with
              local delivery services to bring products to your doorstep. The delivery process is handled off-chain, but
              the payment and product ownership transfer are recorded on the blockchain.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger>Are there any fees?</AccordionTrigger>
            <AccordionContent>
              StarkMarket charges a small fee (2%) on each transaction to maintain the platform. Additionally, there
              will be network fees (gas fees) for processing transactions on Starknet, but these are typically very low
              compared to Ethereum mainnet.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-6">
            <AccordionTrigger>How do returns work?</AccordionTrigger>
            <AccordionContent>
              If you're not satisfied with your purchase, you can initiate a return within 14 days. The return process
              is handled through our smart contract, which will issue a refund once the return is confirmed by our team.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-7">
            <AccordionTrigger>Is my personal information secure?</AccordionTrigger>
            <AccordionContent>
              We only collect the minimum information needed for delivery. Your payment information is never stored on
              our servers, as all transactions happen directly through the blockchain. Your wallet address is public on
              the blockchain, but your identity remains private unless you choose to share it.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-8">
            <AccordionTrigger>How can I become a vendor?</AccordionTrigger>
            <AccordionContent>
              We're currently working on a vendor onboarding process. If you're interested in selling products on
              StarkMarket, please contact us through the Contact page, and we'll get back to you with more information.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
