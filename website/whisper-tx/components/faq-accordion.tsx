import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FaqAccordion() {
  return (
    <section>
      <h2 className="text-3xl font-serif text-slate-800 dark:text-white text-center mb-8">
        Frequently Asked Questions
      </h2>

      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1" className="border-purple-100 dark:border-purple-900">
            <AccordionTrigger className="text-slate-800 dark:text-white font-medium hover:text-purple-700 dark:hover:text-purple-400">
              What if I lose my coupon?
            </AccordionTrigger>
            <AccordionContent className="text-slate-600 dark:text-slate-300">
              Unfortunately, if you lose your coupon code and haven't saved it to your wallet, there's no way to recover
              your funds. The coupon code is the only proof of your right to withdraw the funds, and for privacy
              reasons, we don't store any connection between deposits and withdrawals.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="border-purple-100 dark:border-purple-900">
            <AccordionTrigger className="text-slate-800 dark:text-white font-medium hover:text-purple-700 dark:hover:text-purple-400">
              Can I cancel a deposit?
            </AccordionTrigger>
            <AccordionContent className="text-slate-600 dark:text-slate-300">
              Once a deposit is made, it cannot be canceled or reversed. This is by design to ensure the privacy and
              immutability of the system. You can, however, immediately use your coupon code to withdraw the funds to
              any wallet address, including the original one.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="border-purple-100 dark:border-purple-900">
            <AccordionTrigger className="text-slate-800 dark:text-white font-medium hover:text-purple-700 dark:hover:text-purple-400">
              Is GhostTX legal?
            </AccordionTrigger>
            <AccordionContent className="text-slate-600 dark:text-slate-300">
              GhostTX is a privacy tool, not a means to evade legal obligations. While privacy is a fundamental right,
              users are responsible for complying with all applicable laws in their jurisdictions, including tax laws
              and anti-money laundering regulations.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="border-purple-100 dark:border-purple-900">
            <AccordionTrigger className="text-slate-800 dark:text-white font-medium hover:text-purple-700 dark:hover:text-purple-400">
              Does GhostTX store any user data?
            </AccordionTrigger>
            <AccordionContent className="text-slate-600 dark:text-slate-300">
              GhostTX does not store any user data that could identify you or link your deposits to withdrawals. The
              only data stored on-chain is a cryptographic hash of your coupon code, which cannot be reversed to find
              your original code or connect it to your identity.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5" className="border-purple-100 dark:border-purple-900">
            <AccordionTrigger className="text-slate-800 dark:text-white font-medium hover:text-purple-700 dark:hover:text-purple-400">
              Why do I need to send fixed SOL amounts?
            </AccordionTrigger>
            <AccordionContent className="text-slate-600 dark:text-slate-300">
              Fixed amounts are essential for privacy. If everyone deposits and withdraws unique amounts, it would be
              easy to correlate specific deposits with withdrawals. By using standardized amounts (0.001, 0.1, or 1
              SOL), all transactions look identical, making it impossible to trace the flow of funds.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  )
}
