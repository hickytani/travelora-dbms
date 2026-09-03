import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Calendar, Database, MapPin, Plane, ShieldCheck } from 'lucide-react';
import { destinationApi, packageApi } from '../services/api';
import { Destination, Package } from '../types';

gsap.registerPlugin(ScrollTrigger);

const destinationImages: Record<string, string> = {
  Dubai: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=85',
  Paris: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=85',
  Tokyo: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=85',
  Bali: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=85',
  Switzerland: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=85',
  Singapore: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=85',
  London: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=85',
  'New York': 'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&w=1200&q=85',
};
const fallbackImage = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=85';

function imageFor(city?: string) {
  return (city && destinationImages[city]) || fallbackImage;
}

export default function Home() {
  const [featuredPackages, setFeaturedPackages] = useState<Package[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [packageCount, setPackageCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const page = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([packageApi.getAll(), destinationApi.getAll()])
      .then(([packageResponse, destinationResponse]) => {
        const packages = packageResponse.data.data || [];
        setPackageCount(packages.length);
        setFeaturedPackages(packages.slice(0, 6));
        setDestinations(destinationResponse.data.data?.slice(0, 4) || []);
      })
      .catch(() => setError('Travel data is temporarily unavailable. Please refresh in a moment.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!page.current || loading) return;
    const context = gsap.context(() => {
      gsap.from('.hero-reveal', { y: 32, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out' });
      gsap.utils.toArray<HTMLElement>('.scroll-reveal').forEach((element) => {
        gsap.from(element, { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 84%', once: true } });
      });
    }, page);
    return () => context.revert();
  }, [loading]);

  return (
    <div ref={page} className="home-page">
      <section className="hero relative min-h-[calc(100vh-4rem)] overflow-hidden text-white">
        <img className="hero-media" src={fallbackImage} alt="Aerial view of a coastline at sunset" />
        <div className="hero-shade" />
        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-end px-5 pb-20 pt-24 sm:px-8 lg:pb-28">
          <div className="max-w-3xl">
            <p className="hero-reveal eyebrow">TRAVELORA / CURATED ESCAPES</p>
            <h1 className="hero-reveal mt-5 text-5xl font-semibold leading-[0.98] tracking-tight sm:text-7xl lg:text-8xl">Discover your next journey.</h1>
            <p className="hero-reveal mt-7 max-w-xl text-lg leading-8 text-white/80 sm:text-xl">Explore remarkable destinations, considered packages, hotels and flights in one seamless experience.</p>
            <div className="hero-reveal mt-9 flex flex-wrap items-center gap-4"><Link to="/packages" className="btn-light">Explore packages <ArrowUpRight size={18} /></Link><Link to="/destinations" className="btn-outline-light">Discover destinations</Link></div>
          </div>
          <a href="#explore" className="scroll-cue absolute bottom-7 right-5 hidden items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/70 sm:flex">Scroll to explore <span className="scroll-line" /></a>
        </div>
      </section>

      <main>
        <section id="explore" className="section-shell border-b border-slate-200 bg-[#f8f8f5]"><div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end lg:py-28"><div className="scroll-reveal"><p className="eyebrow text-slate-500">A more thoughtful way to travel</p><h2 className="display-title mt-4 max-w-xl">Go further. Feel more.</h2></div><div className="scroll-reveal max-w-xl lg:justify-self-end"><p className="text-lg leading-8 text-slate-600">From the first idea to the final confirmation, Travelora keeps every part of your journey connected and clear.</p><div className="mt-8 flex gap-8 border-t border-slate-300 pt-5 text-sm text-slate-700"><span><strong className="block text-2xl text-slate-950">{destinations.length}</strong> destinations</span><span><strong className="block text-2xl text-slate-950">{packageCount}</strong> curated packages</span><span><strong className="block text-2xl text-slate-950">5</strong> connected steps</span></div></div></div></section>
+
  <section className="section-shell bg-white"><div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28"><div className="mb-10 flex flex-wrap items-end justify-between gap-5 scroll-reveal"><div><p className="eyebrow text-slate-500">01 / Explore the world</p><h2 className="section-title mt-3">Popular destinations</h2></div><Link to="/destinations" className="text-sm font-semibold text-slate-700 underline underline-offset-8">View all destinations</Link></div>{error && <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-800">{error}</div>}{loading ? <div className="loading-panel">Loading destinations...</div> : destinations.length === 0 ? <div className="loading-panel">No destinations found.</div> : <div className="grid gap-4 md:grid-cols-4">{destinations.map((destination, index) => <Link key={destination.destination_id} to={`/packages?destination_id=${destination.destination_id}`} className={`destination-tile scroll-reveal ${index === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}><img src={imageFor(destination.city)} alt={`${destination.city}, ${destination.country}`} loading="lazy" /><div className="tile-gradient" /><div className="relative z-10 mt-auto"><p className="text-sm text-white/70">{destination.country}</p><h3 className={`${index === 0 ? 'text-4xl' : 'text-2xl'} mt-1 font-semibold text-white`}>{destination.city}</h3><span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/85">Explore <ArrowUpRight size={15} /></span></div></Link>)}</div>}</div></section>
+
        <section className="section-shell bg-[#f8f8f5]"><div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28"><div className="mb-10 flex flex-wrap items-end justify-between gap-5 scroll-reveal"><div><p className="eyebrow text-slate-500">02 / Designed for discovery</p><h2 className="section-title mt-3">Featured journeys</h2></div><Link to="/packages" className="text-sm font-semibold text-slate-700 underline underline-offset-8">Browse all packages</Link></div>{loading ? <div className="loading-panel">Loading packages...</div> : featuredPackages.length === 0 ? <div className="loading-panel">No packages found.</div> : <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{featuredPackages.map((pkg) => <Link key={pkg.package_id} to={`/packages/${pkg.package_id}`} className="package-card scroll-reveal"><div className="package-image"><img src={imageFor(pkg.city)} alt={pkg.city ? `${pkg.city} travel package` : 'Travel package'} loading="lazy" /><span className="package-category">{pkg.category || 'Curated'}</span></div><div className="p-5"><div className="flex items-start justify-between gap-4"><div><p className="text-sm text-slate-500">{pkg.city}, {pkg.country}</p><h3 className="mt-1 text-xl font-semibold text-slate-950">{pkg.title}</h3></div><ArrowUpRight className="text-slate-400" size={20} /></div><div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4 text-sm text-slate-500"><span className="flex items-center gap-2"><Calendar size={15} /> {pkg.duration} days</span><span className="text-lg font-semibold text-slate-950">₹{Number(pkg.price).toLocaleString('en-IN')}</span></div></div></Link>)}</div>}</div></section>

        <section className="section-shell bg-slate-950 text-white"><div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28"><div className="max-w-2xl scroll-reveal"><p className="eyebrow text-white/50">03 / The Travelora flow</p><h2 className="display-title mt-4 text-white">From idea to itinerary, beautifully simple.</h2></div><div className="mt-16 grid gap-px overflow-hidden rounded-2xl bg-white/15 md:grid-cols-5">{[['01', 'Explore', 'Find a destination and discover what fits.'], ['02', 'Choose', 'Select a package, hotel and flight.'], ['03', 'Book', 'Create a real booking in seconds.'], ['04', 'Pay', 'Complete a secure academic simulation.'], ['05', 'Travel', 'Keep your confirmed journey close.']].map(([number, title, text]) => <div key={number} className="scroll-reveal bg-slate-950 p-6 lg:p-7"><span className="text-sm text-cyan-300">{number}</span><h3 className="mt-14 text-xl font-semibold">{title}</h3><p className="mt-3 text-sm leading-6 text-white/55">{text}</p></div>)}</div></div></section>

        <section className="section-shell bg-white"><div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:items-center lg:py-28"><div className="scroll-reveal"><p className="eyebrow text-slate-500">04 / Every journey, connected</p><h2 className="display-title mt-4">One relational system behind every escape.</h2><p className="mt-6 max-w-lg text-lg leading-8 text-slate-600">Your destination, package, hotel, flight, booking and payment stay connected through the Travelora database.</p><Link to="/login" className="btn-dark mt-8">Start planning <ArrowUpRight size={18} /></Link></div><div className="db-flow scroll-reveal"><div className="flow-node"><MapPin size={17} /> Destination</div><div className="flow-connector" /><div className="flow-node active"><Plane size={17} /> Package</div><div className="flow-connector" /><div className="flow-split"><div className="flow-node"><Calendar size={17} /> Booking</div><div className="flow-node"><ShieldCheck size={17} /> Payment</div></div><div className="flow-foot"><Database size={15} /> PostgreSQL-backed workflow</div></div></div></section>

        <section className="cta-band"><div className="mx-auto max-w-7xl px-5 py-20 text-center sm:px-8 lg:py-28"><p className="eyebrow text-white/60">Your next chapter starts here</p><h2 className="mx-auto mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-6xl">Leave room for the unexpected.</h2><Link to="/packages" className="btn-light mt-9">Explore packages <ArrowUpRight size={18} /></Link></div></section>
      </main>
    </div>
  );
}
