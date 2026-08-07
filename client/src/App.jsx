import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import { CartProvider } from "./cart/CartContext.jsx";
import { COPY } from "./data/copy.js";
import AdminPage from "./pages/AdminPage.jsx";
import ComplaintPage from "./pages/ComplaintPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import { useEffect, useState } from "react";

const LANG_KEY = "globalstores_lang";

function useLanguage() {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem(LANG_KEY);
    return saved === "ar" ? "ar" : "en";
  });

  useEffect(() => {
    localStorage.setItem(LANG_KEY, lang);
    document.documentElement.lang = lang === "ar" ? "ar" : "en";
    document.body.classList.toggle("rtl", lang === "ar");
  }, [lang]);

  return [lang, setLang];
}

export default function App() {
  const [lang, setLang] = useLanguage();
  const t = COPY[lang];

  return (
    <CartProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route element={<Layout lang={lang} setLang={setLang} t={t} />}>
            <Route index element={<HomePage lang={lang} t={t} />} />
            <Route path="complaint" element={<ComplaintPage t={t} />} />
            <Route path="admin" element={<AdminPage t={t} />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}
