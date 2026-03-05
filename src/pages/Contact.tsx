import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Neem contact op
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Heeft u vragen over ArboMatcher? Wij staan klaar om u te helpen.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[20px] p-6 sm:p-8 lg:p-10 shadow-sm border border-gray-100">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-[#4FA151]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-[#4FA151]" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#0F172A] mb-3">
                    Bericht verzonden
                  </h2>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Bedankt voor uw bericht. Wij nemen zo spoedig mogelijk contact met u op, meestal binnen 24 uur.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
                    }}
                    className="mt-8 text-[#4FA151] font-medium hover:underline"
                  >
                    Nieuw bericht versturen
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-[#0F172A] mb-2">
                    Stuur ons een bericht
                  </h2>
                  <p className="text-gray-600 mb-8">
                    Vul onderstaand formulier in en wij reageren zo snel mogelijk.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-[#0F172A] mb-2">
                          Naam *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-[12px] border border-gray-200 focus:border-[#4FA151] focus:ring-2 focus:ring-[#4FA151]/20 outline-none transition"
                          placeholder="Uw volledige naam"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-[#0F172A] mb-2">
                          E-mailadres *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-[12px] border border-gray-200 focus:border-[#4FA151] focus:ring-2 focus:ring-[#4FA151]/20 outline-none transition"
                          placeholder="uw@email.nl"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-[#0F172A] mb-2">
                          Telefoonnummer
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-[12px] border border-gray-200 focus:border-[#4FA151] focus:ring-2 focus:ring-[#4FA151]/20 outline-none transition"
                          placeholder="06 12345678"
                        />
                      </div>
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-[#0F172A] mb-2">
                          Onderwerp *
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          required
                          value={formData.subject}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-[12px] border border-gray-200 focus:border-[#4FA151] focus:ring-2 focus:ring-[#4FA151]/20 outline-none transition bg-white"
                        >
                          <option value="">Selecteer onderwerp</option>
                          <option value="algemeen">Algemene vraag</option>
                          <option value="arts">Vraag als arts</option>
                          <option value="opdrachtgever">Vraag als opdrachtgever</option>
                          <option value="technisch">Technische vraag</option>
                          <option value="samenwerking">Samenwerking</option>
                          <option value="anders">Anders</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-[#0F172A] mb-2">
                        Uw bericht *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-[12px] border border-gray-200 focus:border-[#4FA151] focus:ring-2 focus:ring-[#4FA151]/20 outline-none transition resize-none"
                        placeholder="Waar kunnen wij u mee helpen?"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto px-8 py-3.5 bg-[#4FA151] text-white font-semibold rounded-[12px] hover:bg-[#3E8E45] transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
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

          <div className="space-y-6">
            <div className="bg-white rounded-[20px] p-6 sm:p-8 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-[#0F172A] mb-6">Contactgegevens</h3>
              <div className="space-y-5">
                <a
                  href="tel:013-1234567"
                  className="flex items-start gap-4 group"
                >
                  <div className="w-10 h-10 bg-[#4FA151]/10 rounded-[10px] flex items-center justify-center flex-shrink-0 group-hover:bg-[#4FA151]/20 transition">
                    <Phone className="w-5 h-5 text-[#4FA151]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-0.5">Telefoon</p>
                    <p className="font-medium text-[#0F172A] group-hover:text-[#4FA151] transition">013-1234567</p>
                  </div>
                </a>

                <a
                  href="mailto:info@arbomatcher.nl"
                  className="flex items-start gap-4 group"
                >
                  <div className="w-10 h-10 bg-[#4FA151]/10 rounded-[10px] flex items-center justify-center flex-shrink-0 group-hover:bg-[#4FA151]/20 transition">
                    <Mail className="w-5 h-5 text-[#4FA151]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-0.5">E-mail</p>
                    <p className="font-medium text-[#0F172A] group-hover:text-[#4FA151] transition">info@arbomatcher.nl</p>
                  </div>
                </a>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#4FA151]/10 rounded-[10px] flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[#4FA151]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-0.5">Adres</p>
                    <p className="font-medium text-[#0F172A]">
                      ArboMatcher B.V.<br />
                      Lovensekanaaldijk 7<br />
                      5046 AV Tilburg<br />
                      Nederland
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[20px] p-6 sm:p-8 shadow-sm border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#0F172A]/5 rounded-[10px] flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-[#0F172A]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#0F172A] mb-2">Openingstijden</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-baseline gap-4">
                      <span className="text-gray-600 shrink-0">Maandag – Vrijdag</span>
                      <span className="font-medium text-[#0F172A] tabular-nums whitespace-nowrap">09:00 – 17:00</span>
                    </div>
                    <div className="flex justify-between items-baseline gap-4">
                      <span className="text-gray-600 shrink-0">Weekend</span>
                      <span className="font-medium text-[#0F172A] whitespace-nowrap">Gesloten</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#0F172A] rounded-[20px] p-6 sm:p-8 text-white">
              <h3 className="font-bold mb-3">Bedrijfsgegevens</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <p><span className="text-gray-500">KvK:</span> 12345678</p>
                <p><span className="text-gray-500">BTW:</span> NL123456789B01</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
