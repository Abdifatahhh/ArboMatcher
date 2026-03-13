import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { faqGroups } from '../data/faq';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSubmitted(true);
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const faqPreview = faqGroups.flatMap(g => g.items).slice(0, 5);

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="w-8 h-8 text-slate-400" />
            <span className="text-slate-400 font-semibold text-sm uppercase tracking-wider">Contact</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Neem contact op</h1>
          <p className="text-xl text-slate-300 max-w-2xl">
            Heeft u vragen over ArboMatcher? Wij staan klaar om u te helpen.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-10">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-lg shadow-slate-200/40 border border-slate-100 overflow-hidden">
              {submitted ? (
                <div className="text-center py-14 px-4">
                  <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6 ring-4 ring-slate-100">
                    <CheckCircle className="w-10 h-10 text-slate-700" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mb-3">
                    Bericht verzonden
                  </h2>
                  <p className="text-slate-600 max-w-md mx-auto leading-relaxed">
                    Bedankt voor uw bericht. Wij nemen zo spoedig mogelijk contact met u op, meestal binnen 48 uur.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
                    }}
                    className="mt-8 inline-flex items-center gap-2 text-[#0F172A] font-semibold hover:text-slate-700 transition"
                  >
                    Nieuw bericht versturen
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-[#0F172A] tracking-tight">
                      Stuur ons een bericht
                    </h2>
                    <p className="text-slate-600 mt-2">
                      Vul onderstaand formulier in en wij reageren zo snel mogelijk.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">
                          Naam *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-slate-400 focus:ring-2 focus:ring-slate-900/20 outline-none transition text-[#0F172A] placeholder:text-slate-400"
                          placeholder="Uw volledige naam"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                          E-mailadres *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-slate-400 focus:ring-2 focus:ring-slate-900/20 outline-none transition text-[#0F172A] placeholder:text-slate-400"
                          placeholder="uw@email.nl"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1.5">
                          Telefoonnummer
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-slate-400 focus:ring-2 focus:ring-slate-900/20 outline-none transition text-[#0F172A] placeholder:text-slate-400"
                          placeholder="06 12345678"
                        />
                      </div>
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-1.5">
                          Onderwerp *
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          required
                          value={formData.subject}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-slate-400 focus:ring-2 focus:ring-slate-900/20 outline-none transition text-[#0F172A] bg-white"
                        >
                          <option value="">Selecteer onderwerp</option>
                          <option value="algemeen">Algemene vraag</option>
                          <option value="arts">Vraag als professional</option>
                          <option value="organisatie">Vraag als organisatie</option>
                          <option value="technisch">Technische vraag</option>
                          <option value="samenwerking">Samenwerking</option>
                          <option value="anders">Anders</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1.5">
                        Uw bericht *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-slate-400 focus:ring-2 focus:ring-slate-900/20 outline-none transition resize-none text-[#0F172A] placeholder:text-slate-400"
                        placeholder="Waar kunnen wij u mee helpen?"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto min-w-[200px] px-8 py-4 bg-[#0F172A] text-white font-semibold rounded-xl hover:bg-[#1E293B] transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-slate-900/10 hover:shadow-slate-200/50"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Verzenden...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Verstuur bericht
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>

          <div className="space-y-5">
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
              <h3 className="text-lg font-bold text-[#0F172A] mb-4 px-1">Contactgegevens</h3>
              <div className="space-y-2.5">
                <a href="tel:013-1234567" className="flex items-start gap-4 group bg-white rounded-xl px-4 py-3.5 border border-slate-200 shadow-sm hover:shadow-md transition">
                  <div className="w-11 h-11 bg-slate-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#0F172A] transition">
                    <Phone className="w-5 h-5 text-slate-700 group-hover:text-white transition" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-0.5">Telefoon</p>
                    <p className="font-semibold text-[#0F172A]">013-1234567</p>
                  </div>
                </a>
                <a href="mailto:info@arbomatcher.nl" className="flex items-start gap-4 group bg-white rounded-xl px-4 py-3.5 border border-slate-200 shadow-sm hover:shadow-md transition">
                  <div className="w-11 h-11 bg-slate-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#0F172A] transition">
                    <Mail className="w-5 h-5 text-slate-700 group-hover:text-white transition" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-0.5">E-mail</p>
                    <p className="font-semibold text-[#0F172A] break-all">info@arbomatcher.nl</p>
                  </div>
                </a>
                <div className="flex items-start gap-4 bg-white rounded-xl px-4 py-3.5 border border-slate-200 shadow-sm">
                  <div className="w-11 h-11 bg-slate-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-slate-700" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-0.5">Adres</p>
                    <p className="font-semibold text-[#0F172A] leading-snug">
                      ArboMatcher B.V.<br />Lovensekanaaldijk 7<br />5046 AV Tilburg<br />Nederland
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
              <h3 className="font-bold text-[#0F172A] mb-3 px-1">Openingstijden</h3>
              <div className="space-y-2.5">
                <div className="flex justify-between items-baseline gap-4 bg-white rounded-xl px-4 py-3 border border-slate-200 shadow-sm text-sm">
                  <span className="text-slate-600 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    Maandag – Vrijdag
                  </span>
                  <span className="font-semibold text-[#0F172A] tabular-nums whitespace-nowrap">09:00 – 17:00</span>
                </div>
                <div className="flex justify-between items-baseline gap-4 bg-white rounded-xl px-4 py-3 border border-slate-200 shadow-sm text-sm">
                  <span className="text-slate-600">Weekend</span>
                  <span className="font-semibold text-[#0F172A] whitespace-nowrap">Gesloten</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
              <h3 className="font-bold text-[#0F172A] mb-3 px-1">Bedrijfsgegevens</h3>
              <div className="space-y-2.5">
                <div className="flex justify-between items-baseline bg-white rounded-xl px-4 py-3 border border-slate-200 shadow-sm text-sm">
                  <span className="text-slate-500">KvK</span>
                  <span className="font-semibold text-[#0F172A]">12345678</span>
                </div>
                <div className="flex justify-between items-baseline bg-white rounded-xl px-4 py-3 border border-slate-200 shadow-sm text-sm">
                  <span className="text-slate-500">BTW</span>
                  <span className="font-semibold text-[#0F172A]">NL123456789B01</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-16 sm:mt-20">
          <div className="flex items-center gap-3 mb-6">
            <HelpCircle className="w-6 h-6 text-slate-700" />
            <h2 className="text-2xl font-bold text-[#0F172A]">Veelgestelde vragen</h2>
          </div>
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-2.5">
            {faqPreview.map((item) => (
              <ContactFaqItem key={item.q} q={item.q} a={item.a} />
            ))}
            <div className="pt-2 px-1">
              <Link
                to="/faq"
                className="inline-flex items-center gap-2 text-[#0F172A] font-semibold hover:text-slate-700 transition"
              >
                Bekijk alle veelgestelde vragen
                <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function ContactFaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm transition-all ${open ? 'ring-1 ring-slate-200' : ''}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3.5 px-4 text-left hover:bg-slate-50/50 transition rounded-xl"
      >
        <span className="font-semibold text-[#0F172A] pr-4">{q}</span>
        {open ? <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />}
      </button>
      {open && (
        <div className="pb-4 px-4">
          <p className="text-slate-600 leading-relaxed text-sm">{a}</p>
        </div>
      )}
    </div>
  );
}
