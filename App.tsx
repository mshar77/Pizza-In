import { useMemo, useRef, useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, Clock3, MapPin, Minus, Phone, Plus, ShoppingBag, Sparkles, Truck, X, Zap } from "lucide-react";

type Product = { id: string; name: string; en: string; price: number; desc: string; image: string; tag?: string };
type CartItem = Product & { qty: number; extras?: string[]; extraCost?: number };

const PHONE = "966535133216";
const MAP = "https://maps.app.goo.gl/3AAqRgsEBjG9nXQE7?g_st=ac";

const products: Product[] = [
  { id: "pizza-in-special", name: "بيتزا إن سبيشل", en: "Pizza In Special", price: 31, desc: "دجاج، لحم، فلفل، زيتون، مشروم وجبن", image: "/images/menu.png", tag: "الأكثر طلباً" },
  { id: "pizza-chicken", name: "بيتزا دجاج", en: "Chicken Pizza", price: 29, desc: "دجاج، فلفل، زيتون، مشروم وجبن", image: "/images/menu.png" },
  { id: "pizza-beef", name: "بيتزا لحم", en: "Beef Pizza", price: 29, desc: "لحم، فلفل، زيتون، مشروم وجبن", image: "/images/menu.png" },
  { id: "pizza-vegetable", name: "بيتزا خضار", en: "Vegetable Pizza", price: 26, desc: "خضار مشكلة، زيتون، فلفل وجبن", image: "/images/menu.png" },
  { id: "pizza-cheese", name: "بيتزا جبنة", en: "Cheese Pizza", price: 25, desc: "جبنة موزاريلا وصوص البيتزا", image: "/images/menu.png" },
  { id: "loaded-wedges", name: "لودد وجز", en: "Loaded Wedges", price: 16, desc: "بطاطس ودجز، دجاج، صوص وجبن", image: "/images/loaded-items.png", tag: "جديد" },
  { id: "loaded-fries", name: "لودد فرايز", en: "Loaded Fries", price: 16, desc: "بطاطس، دجاج، صوص وجبن", image: "/images/loaded-items.png" },
  { id: "chicken-burger", name: "برجر دجاج", en: "Chicken Burger", price: 8, desc: "برجر دجاج مع خس وصوص", image: "/images/menu.png" },
  { id: "potato-wedges", name: "بطاطس ودجز", en: "Potato Wedges", price: 7, desc: "ودجز مقرمشة بتتبيلة خاصة", image: "/images/menu.png" },
  { id: "onion-rings", name: "حلقات بصل", en: "Onion Rings", price: 7, desc: "حلقات بصل ذهبية ومقرمشة", image: "/images/menu.png" },
];

const categories = ["الكل", "بيتزا", "وجبات", "برجر", "إضافات"];

function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [category, setCategory] = useState("الكل");
  const [cartOpen, setCartOpen] = useState(false);
  const [orderType, setOrderType] = useState<"delivery" | "pickup">("delivery");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [customProduct, setCustomProduct] = useState<Product | null>(null);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const offerTrackRef = useRef<HTMLDivElement>(null);
  const extras = [{ name: "شرائح جبنة", price: 1 }, { name: "أطراف جبنة", price: 5 }, { name: "صوص إضافي", price: 3 }];

  const filtered = useMemo(() => category === "الكل" ? products : products.filter((p) => category === "بيتزا" ? p.id.startsWith("pizza") : category === "وجبات" ? ["loaded-wedges", "loaded-fries"].includes(p.id) : category === "برجر" ? p.id.includes("burger") : ["potato-wedges", "onion-rings"].includes(p.id)), [category]);
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const add = (product: Product, chosen: string[] = []) => {
    const extraCost = extras.filter((extra) => chosen.includes(extra.name)).reduce((sum, extra) => sum + extra.price, 0);
    setCart((current) => [...current, { ...product, id: `${product.id}-${Date.now()}`, qty: 1, extras: chosen, extraCost, price: product.price + extraCost }]);
    setCustomProduct(null); setSelectedExtras([]); setCartOpen(true);
  };
  const changeQty = (id: string, delta: number) => setCart((current) => current.map((item) => item.id === id ? { ...item, qty: item.qty + delta } : item).filter((item) => item.qty > 0));
  const sendOrder = () => {
    if (!cart.length) return;
    const lines = cart.map((item) => `• ${item.qty} × ${item.name} — ${item.price * item.qty} ريال`).join("\n");
    const details = orderType === "delivery" ? `العنوان: ${address || "سيتم تحديده بالتواصل"}` : "طريقة الاستلام: استلام من الفرع";
    const text = `طلب جديد من موقع بيتزا إن\nالاسم: ${name || "عميل الموقع"}\n${lines}\n${details}\nالإجمالي: ${total} ريال`;
    window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`, "_blank");
  };

  return <div className="site" dir="rtl">
    <header className="topbar"><div className="container nav"><a className="brand" href="#home"><span className="brand-mark">π</span><span><b>بيتزا إن</b><small>PIZZA IN</small></span></a><nav><a href="#menu">المنيو</a><a href="#offers">العروض</a><a href="#about">عنّا</a></nav><div className="nav-actions"><a className="phone" href={`tel:+${PHONE}`}><Phone size={16}/> 053 513 3216</a><button className="cart-button" onClick={() => setCartOpen(true)}><ShoppingBag size={19}/><span>السلة</span>{count > 0 && <em>{count}</em>}</button></div></div></header>

    <main id="home">
      <section className="hero"><div className="container hero-grid"><div className="hero-copy"><div className="eyebrow"><Sparkles size={15}/> نكهة تستاهل التجربة</div><h1>خلّها <span>بيتزا إن</span><br/>وخلك على السريع.</h1><p>بيتزا طازجة، إضافاتك على كيفك، وطلبك يوصل حار لحد بابك في جدة.</p><div className="hero-buttons"><a className="primary" href="#menu">اطلب الآن <ArrowLeft size={18}/></a><a className="secondary" href={MAP} target="_blank" rel="noreferrer"><MapPin size={17}/> موقع الفرع</a></div><div className="hero-meta"><span><Clock3 size={17}/> مفتوح اليوم حتى 2:00 ص</span><span><Truck size={17}/> توصيل واستلام</span></div></div><div className="hero-visual"><div className="hero-glow"/><img src="/images/family-offer.png" alt="عرض العائلة من بيتزا إن"/><div className="hero-badge"><b>89</b><span>ريال فقط</span></div></div></div></section>

      <section id="offers" className="offers-section"><div className="container"><div className="section-heading"><div><span className="kicker">OFFERS YOU'LL LOVE</span><h2>عروض تخلّي اللمة أحلى</h2></div><div className="slider-arrows"><button aria-label="السابق" onClick={() => offerTrackRef.current?.scrollBy({ left: 520, behavior: "smooth" })}><ChevronRight size={20}/></button><button aria-label="التالي" onClick={() => offerTrackRef.current?.scrollBy({ left: -520, behavior: "smooth" })}><ChevronLeft size={20}/></button></div></div><div className="offer-track" ref={offerTrackRef}><article className="offer-card offer-main"><img src="/images/family-offer.png" alt="عرض العائلة"/><div className="offer-overlay"><span>عرض العائلة المميز</span><b>كلها بـ 89 ريال</b></div></article><article className="offer-card"><img src="/images/loaded-items.png" alt="لودد وجز ولودد فرايز"/><div className="offer-overlay"><span>جديد من بيتزا إن</span><b>لودد بـ 16 ريال</b></div></article><article className="offer-card offer-dark"><div><Zap size={25}/><span>اطلبها من الموقع</span><b>وزيد إضافتك</b></div><a href="#menu">تصفح المنيو <ArrowLeft size={16}/></a></article></div></div></section>

      <section id="menu" className="menu-section"><div className="container"><div className="section-heading menu-heading"><div><span className="kicker">FRESH FROM THE OVEN</span><h2>اختار مزاجك اليوم</h2><p>كل طلب يتجهز لك طازج وبنفس الحب.</p></div><div className="category-tabs">{categories.map((item) => <button className={category === item ? "active" : ""} key={item} onClick={() => setCategory(item)}>{item}</button>)}</div></div><div className="product-grid">{filtered.map((product) => <article className="product-card" key={product.id}><div className="product-image"><img src={product.image} alt={product.name}/>{product.tag && <span className="product-tag">{product.tag}</span>}<button className="quick-add" onClick={() => { setCustomProduct(product); setSelectedExtras([]); }}><Plus size={20}/></button></div><div className="product-info"><div><h3>{product.name}</h3><small>{product.en}</small></div><b className="price">{product.price}<span> ر.س</span></b></div><p>{product.desc}</p></article>)}</div></div></section>

      <section id="about" className="location-section"><div className="container location-inner"><div><span className="kicker">COME SAY HI</span><h2>نوصلك أو نستقبلك</h2><p>فرعنا في حي مدائن الفهد، جدة. اتصل علينا أو اطلب مباشرة من الموقع.</p><div className="location-links"><a href={`tel:+${PHONE}`}><Phone size={18}/> 053 513 3216</a><a href={MAP} target="_blank" rel="noreferrer"><MapPin size={18}/> افتح الموقع على الخريطة</a></div></div><div className="location-card"><div className="pin"><MapPin size={23}/></div><b>بيتزا إن</b><span>مدائن الفهد، جدة</span><a href={MAP} target="_blank" rel="noreferrer">الاتجاهات <ArrowLeft size={16}/></a></div></div></section>
    </main>

    <footer><div className="container footer-inner"><a className="brand" href="#home"><span className="brand-mark">π</span><span><b>بيتزا إن</b><small>PIZZA IN</small></span></a><span>كل لقمة… لها قصة.</span><span>© 2026 Pizza In</span></div></footer>

    {cartOpen && <div className="drawer-backdrop" onClick={() => setCartOpen(false)}><aside className="cart-drawer" onClick={(e) => e.stopPropagation()}><div className="drawer-head"><div><span className="kicker">YOUR ORDER</span><h2>سلتك جاهزة</h2></div><button onClick={() => setCartOpen(false)}><X/></button></div>{cart.length === 0 ? <div className="empty-cart"><ShoppingBag size={38}/><h3>السلة فاضية</h3><p>أضف اللي يشهيك ونجهزه لك.</p><button className="primary" onClick={() => setCartOpen(false)}>تصفح المنيو</button></div> : <><div className="cart-items">{cart.map((item) => <div className="cart-item" key={item.id}><div><b>{item.name}</b>{item.extras?.length ? <small>إضافات: {item.extras.join("، ")}</small> : null}<small>{item.price} ر.س</small></div><div className="qty"><button onClick={() => changeQty(item.id, -1)}><Minus size={14}/></button><span>{item.qty}</span><button onClick={() => changeQty(item.id, 1)}><Plus size={14}/></button></div></div>)}</div><div className="checkout"><div className="order-choice"><button className={orderType === "delivery" ? "selected" : ""} onClick={() => setOrderType("delivery")}><Truck size={17}/> توصيل</button><button className={orderType === "pickup" ? "selected" : ""} onClick={() => setOrderType("pickup")}><ShoppingBag size={17}/> استلام</button></div><input placeholder="اسمك" value={name} onChange={(e) => setName(e.target.value)}/>{orderType === "delivery" && <input placeholder="العنوان أو الحي" value={address} onChange={(e) => setAddress(e.target.value)}/>}<div className="total"><span>الإجمالي</span><b>{total} ر.س</b></div><button className="whatsapp" onClick={sendOrder}>إرسال الطلب عبر واتساب <ArrowLeft size={17}/></button><small className="note">يفتح واتساب برسالة مرتبة لعامل المطعم</small></div></>}</aside></div>}
    {customProduct && <div className="drawer-backdrop" onClick={() => setCustomProduct(null)}><div className="custom-modal" onClick={(e) => e.stopPropagation()}><button className="modal-close" onClick={() => setCustomProduct(null)}><X/></button><img src={customProduct.image} alt=""/><div className="custom-content"><span className="kicker">MAKE IT YOURS</span><h2>{customProduct.name}</h2><p>اختر إضافاتك المفضلة</p>{extras.map((extra) => <label className="extra-option" key={extra.name}><input type="checkbox" checked={selectedExtras.includes(extra.name)} onChange={() => setSelectedExtras((current) => current.includes(extra.name) ? current.filter((x) => x !== extra.name) : [...current, extra.name])}/><span>{extra.name}</span><b>+{extra.price} ر.س</b></label>)}<button className="primary add-custom" onClick={() => add(customProduct, selectedExtras)}>أضف للسلة <Plus size={17}/></button></div></div></div>}
  </div>;
}

export default App;
