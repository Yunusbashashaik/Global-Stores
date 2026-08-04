import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import { COPY } from "./data/copy.js";
import ComplaintPage from "./pages/ComplaintPage.jsx";
import HomePage from "./pages/HomePage.jsx";

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
    <BrowserRouter>
      <Routes>
        <Route element={<Layout lang={lang} setLang={setLang} t={t} />}>
          <Route index element={<HomePage lang={lang} t={t} />} />
          <Route path="complaint" element={<ComplaintPage t={t} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
