import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
    {
        question: "Kalau hujan uang kembali gak?",
        answer: "Untuk lapangan outdoor, kami berikan jaminan reschedule gratis jika hujan deras. Uang tidak hangus, tapi masuk ke credit balance kamu."
    },
    {
        question: "Bisa sewa raket gak?",
        answer: "Bisa banget! Kami menyewakan raket berbagai tipe mulai dari beginner sampai pro di Pro Shop dengan harga terjangkau."
    },
    {
        question: "Boleh bawa makanan dari luar?",
        answer: "Kami menyarankan untuk mendukung tenant F&B kami. Namun untuk air mineral botolan pribadi diperbolehkan."
    },
    {
        question: "Apakah ada instruktur / coach?",
        answer: "Ada. Kami memiliki Head Coach bersertifikat yang siap melatih dari level pemula hingga mahir. Hubungi admin untuk jadwal."
    }
]

export function FAQ() {
    return (
        <section className="py-24 bg-zinc-50">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="text-center mb-12 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-zinc-900">
                        Sering Ditanyakan
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Jawaban buat pertanyaan yang mungkin kamu pikirin.
                    </p>
                </div>

                <Accordion type="single" collapsible className="w-full space-y-4">
                    {faqs.map((faq, i) => (
                        <AccordionItem key={i} value={`item-${i}`} className="bg-white border border-zinc-200 rounded-xl px-4 shadow-sm hover:shadow-md transition-all">
                            <AccordionTrigger className="text-base md:text-lg font-bold text-zinc-900 py-6 hover:no-underline">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-base text-zinc-600 pb-6 leading-relaxed">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    )
}
