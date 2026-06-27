"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const FAQ_ITEMS = [
  {
    id: "sabit-fiyat",
    question: "Fiyatlar gerçekten sabit mi, kapıda ekstra ücret çıkar mı?",
    answer:
      "Sistemimizin size sunduğu tutar, rotanıza ve kat bilgilerinize göre hesaplanan net fiyattır. WhatsApp üzerinden eşyalarınızın fotoğrafını gönderip teyit ettikten sonra, taşıma günü kesinlikle sürpriz bir maliyet veya ek ücret talep edilmez.",
  },
  {
    id: "parca-esya",
    question: "Sadece birkaç parça eşyam var, taşıyor musunuz?",
    answer:
      'Evet, sistemimiz hem komple ev taşıma hem de tekil eşyalar için özel olarak tasarlanmıştır. İster tek bir beyaz eşya, ister ikinci el aldığınız bir koltuk takımı olsun, "Parça Eşya Taşıma" seçeneğiyle anında fiyat alabilirsiniz.',
  },
  {
    id: "fiyat-hesaplama",
    question: "Nakliye fiyatları nasıl hesaplanır?",
    answer: `Nakliye fiyatları standart bir ücrete tabi olmayıp; mesafe, eşya miktarı (hacim/tonaj), kat durumları, araç tipi ve ek hizmetlere göre hesaplanır. Evden eve nakliyatta fiyatlar ortalama 20.000 TL ile 90.000 TL arasında değişiklik gösterir. Fiyatlandırmayı belirleyen temel faktörler şunlardır:<br/><br/>
<ul>
<li><strong>Mesafe ve Rota:</strong> Şehir içi veya şehirler arası mesafe (kilometre), yakıt tüketimini ve personel mesaisini doğrudan artırır. Ayrıca güzergah üzerindeki otoyol/köprü geçiş ücretleri de eklenir.</li>
<li><strong>Eşya Hacmi ve Ağırlığı:</strong> Eşyaların kapladığı alan (metreküp) kullanılacak aracın büyüklüğünü belirler. Parça eşya, 1+1, 3+1 veya villa boyutuna göre nakliye maliyetleri değişir.</li>
<li><strong>Kat Durumu ve Asansör İhtiyacı:</strong> Taşınılacak binaların katları ve binada asansör olup olmaması fiyatı etkiler. Asansörsüz veya dar merdivenli binalarda modüler asansörlü vinç kurulumu hizmeti gerekebilir.</li>
<li><strong>Ek Hizmetler:</strong> Mobilyaların sökülüp kurulması (marangozluk), beyaz eşya montajları, özel ambalajlama ve sigorta işlemleri toplam tutarı değiştirir.</li>
</ul>`,
    html: true,
  },
  {
    id: "evden-eve-kapsam",
    question: "Evden eve taşıma neleri kapsar?",
    answer: `Evden eve nakliyat; mobilya ve beyaz eşyaların sökülüp kurulması, tüm eşyaların ambalajlanması, araca yüklenmesi, yeni adrese taşınması ve odalara yerleştirilmesini kapsayan "anahtar teslim" bir süreçtir.<br/><br/>
<strong>Standart Paket Kapsamı:</strong><br/>
<ul>
<li><strong>Demontaj ve Montaj:</strong> Gardırop, baza, kitaplık gibi mobilyalarınızın sökülmesi ve yeni evde istediğiniz odaya kurularak monte edilmesi.</li>
<li><strong>Ambalajlama ve Paketleme:</strong> Kırılabilir mutfak eşyalarının patpatlı naylonlar ve özel ambalaj kağıtları ile sarılıp kolilenmesi. Mobilyaların çizilmemesi için streç ve battaniyelerle kaplanması.</li>
<li><strong>Beyaz Eşya Kurulumu:</strong> Çamaşır makinesi, bulaşık makinesi ve fırın gibi eşyaların sökülmesi ve yeni adrese taşındıktan sonra bağlantılarının yapılması.</li>
<li><strong>Taşıma ve Yerleştirme:</strong> Eşyaların özenle araca yüklenmesi, yeni evinizde dilediğiniz odaya taşınması.</li>
</ul>
<br/>
<strong>İsteğe Bağlı Olan (Ekstra) Hizmetler:</strong><br/>
<ul>
<li><strong>Kişisel Eşya Toplama:</strong> Kıyafet ve ufak tefek ev eşyalarının profesyonel ekip tarafından kolilere yerleştirilmesi (genellikle ek ücrete tabidir).</li>
<li><strong>Asansörlü Taşıma:</strong> Eşyaların bina içine sığmaması veya yüksek katlı binalar için dış cephe asansörü kullanılması.</li>
<li><strong>Sigortalama:</strong> Yolculuk esnasında oluşabilecek hasarları karşılamak amacıyla yapılan eşya nakliye sigortası.</li>
</ul>`,
    html: true,
  },
] as const

export default function FaqSection() {
  return (
    <section className="mx-auto w-full max-w-4xl">
      <h2 className="text-balance text-center text-2xl font-bold tracking-tight text-primary sm:text-3xl">
        Sıkça Sorulan Sorular
      </h2>
      <div className="mt-6 rounded-2xl border border-border bg-card px-5 sm:px-6">
        <Accordion type="single" collapsible="true" className="w-full">
          {FAQ_ITEMS.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger className="py-4 text-left text-base font-semibold text-primary hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-pretty leading-relaxed text-muted-foreground [&_li]:mt-2 [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
                {"html" in item && item.html ? (
                  <div dangerouslySetInnerHTML={{ __html: item.answer }} />
                ) : (
                  <p>{item.answer}</p>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
