// Landing page WARUNG NUSANTARA, restoran masakan Indonesia di Jakarta.
// Self-contained: tidak memakai AuthenticatedLayout, tidak menerima props.
// Header/nav + footer inline.
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StickyMobileCta } from '@/components/sticky-mobile-cta';
import { StatCounter } from '@/components/stat-counter';
import {
    Beef,
    Cake,
    CheckCircle2,
    Clock,
    CupSoda,
    Drumstick,
    Fish,
    Leaf,
    MapPin,
    Menu,
    Phone,
    Soup,
    Star,
    UtensilsCrossed,
    Wheat,
    X,
    type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Format rupiah gaya Indonesia.
const rupiah = (n: number) => `Rp${n.toLocaleString('id-ID')}`;

// Jam operasional: 10.00–22.00 setiap hari.
const JAM_BUKA = 10;
const JAM_TUTUP = 22;

interface MenuItem {
    nama: string;
    harga: number;
    deskripsi: string;
    icon: LucideIcon;
    art: string;
    andalan?: boolean;
}

const MENU: Record<'utama' | 'lauk' | 'minuman' | 'penutup', MenuItem[]> = {
    utama: [
        { nama: 'Rendang Sapi', harga: 45000, deskripsi: 'Rendang Padang dimasak 8 jam, daging empuk dan bumbu meresap.', icon: Beef, art: 'from-amber-800 via-orange-900 to-stone-950', andalan: true },
        { nama: 'Nasi Goreng Kampung', harga: 32000, deskripsi: 'Nasi goreng terasi dengan ayam suwir, telur, dan emping.', icon: UtensilsCrossed, art: 'from-amber-700 via-orange-800 to-red-900' },
        { nama: 'Soto Ayam Lamongan', harga: 28000, deskripsi: 'Kuah kuning gurih dengan koya, telur, dan perkedel.', icon: Soup, art: 'from-yellow-500 via-amber-600 to-orange-700', andalan: true },
        { nama: 'Gudeg Jogja Komplit', harga: 35000, deskripsi: 'Gudeg manis dengan ayam opor, telur, tahu, dan krecek.', icon: Drumstick, art: 'from-orange-600 via-amber-700 to-yellow-800' },
        { nama: 'Ayam Bakar Taliwang', harga: 38000, deskripsi: 'Ayam kampung bakar dengan sambal taliwang khas Lombok.', icon: Drumstick, art: 'from-red-600 via-orange-700 to-amber-800' },
        { nama: 'Nasi Liwet Solo', harga: 30000, deskripsi: 'Nasi gurih santan dengan ayam suwir, telur pindang, dan labu siam.', icon: Wheat, art: 'from-yellow-600 via-amber-700 to-orange-800' },
    ],
    lauk: [
        { nama: 'Pecel Lele + Nasi', harga: 25000, deskripsi: 'Lele goreng garing dengan sambal terasi dan lalapan segar.', icon: Fish, art: 'from-teal-600 via-emerald-700 to-green-800', andalan: true },
        { nama: 'Sayur Asem Jakarta', harga: 18000, deskripsi: 'Sayur asem segar dengan jagung, labu, dan melinjo.', icon: Leaf, art: 'from-green-600 via-lime-700 to-emerald-800' },
        { nama: 'Tahu Tempe Bacem', harga: 15000, deskripsi: 'Baceman manis gurih khas Jawa, digoreng dadakan.', icon: Wheat, art: 'from-amber-600 via-yellow-700 to-orange-800' },
        { nama: 'Ikan Bakar Jimbaran', harga: 55000, deskripsi: 'Ikan kakap bakar bumbu Jimbaran dengan sambal matah.', icon: Fish, art: 'from-orange-700 via-red-800 to-stone-900' },
        { nama: 'Capcay Seafood', harga: 35000, deskripsi: 'Sayuran segar dengan udang dan cumi saus tiram.', icon: Leaf, art: 'from-emerald-600 via-teal-700 to-green-800' },
    ],
    minuman: [
        { nama: 'Es Teh Manis Jumbo', harga: 10000, deskripsi: 'Teh melati diseduh pekat, porsi jumbo pelepas dahaga.', icon: CupSoda, art: 'from-amber-500 via-orange-600 to-yellow-700' },
        { nama: 'Es Cendol Dawet', harga: 18000, deskripsi: 'Cendol, santan, dan gula aren asli, segar pol.', icon: CupSoda, art: 'from-lime-500 via-green-600 to-emerald-700', andalan: true },
        { nama: 'Jus Alpukat', harga: 22000, deskripsi: 'Alpukat mentega diblender dengan susu dan cokelat.', icon: CupSoda, art: 'from-green-700 via-lime-800 to-emerald-900' },
        { nama: 'Wedang Jahe', harga: 15000, deskripsi: 'Jahe bakar, gula aren, dan serai, hangat di badan.', icon: CupSoda, art: 'from-orange-700 via-amber-800 to-yellow-900' },
        { nama: 'Es Teler Nusantara', harga: 25000, deskripsi: 'Alpukat, kelapa muda, nangka, dan cincau dalam santan manis.', icon: CupSoda, art: 'from-yellow-400 via-amber-500 to-orange-600' },
    ],
    penutup: [
        { nama: 'Klepon (5 pcs)', harga: 15000, deskripsi: 'Bola ketan pandan isi gula merah dengan taburan kelapa.', icon: Cake, art: 'from-green-600 via-emerald-700 to-teal-800', andalan: true },
        { nama: 'Bubur Sumsum', harga: 12000, deskripsi: 'Bubur santan lembut dengan kuah gula merah.', icon: Cake, art: 'from-stone-500 via-amber-600 to-yellow-700' },
        { nama: 'Pisang Goreng Keju', harga: 20000, deskripsi: 'Pisang raja goreng dengan lelehan keju dan cokelat.', icon: Cake, art: 'from-yellow-500 via-amber-600 to-orange-700' },
        { nama: 'Es Pisang Ijo', harga: 22000, deskripsi: 'Pisang balut adonan hijau dengan bubur sumsum dan sirup.', icon: Cake, art: 'from-lime-600 via-green-700 to-emerald-800' },
    ],
};

const TAB_MENU = [
    { value: 'utama', label: 'Makanan Utama' },
    { value: 'lauk', label: 'Lauk & Sayur' },
    { value: 'minuman', label: 'Minuman' },
    { value: 'penutup', label: 'Jajanan' },
] as const;

const GALERI = [
    { judul: 'Rendang andalan kami', foto: '/images/landing-restoran/galeri-rendang.jpg' },
    { judul: 'Suasana saung lesehan', foto: '/images/landing-restoran/galeri-saung.jpg' },
    { judul: 'Racikan sambal dadakan', foto: '/images/landing-restoran/galeri-sambal.jpg' },
    { judul: 'Ruang makan keluarga', foto: '/images/landing-restoran/galeri-ruang-makan.jpg' },
    { judul: 'Jajanan pasar segar', foto: '/images/landing-restoran/galeri-jajanan.jpg' },
];

const STATS = [
    { label: 'Menu khas daerah', value: 60, suffix: '+' },
    { label: 'Porsi terjual / hari', value: 800, suffix: '+' },
    { label: 'Tahun berdiri', value: 12, suffix: '' },
    { label: 'Rating pengunjung', value: 48, suffix: '/50', display: '4.8' },
];

export default function RestoranLanding() {
    const [menuBuka, setMenuBuka] = useState(false);
    const [tabAktif, setTabAktif] = useState<'utama' | 'lauk' | 'minuman' | 'penutup'>('utama');

    // Dihitung setelah mount: getHours() tergantung timezone, sehingga
    // nilai SSR (server) & klien bisa berbeda → hydration mismatch.
    const [statusResto, setStatusResto] = useState({ buka: true });
    useEffect(() => {
        const jam = new Date().getHours();
        setStatusResto({ buka: jam >= JAM_BUKA && jam < JAM_TUTUP });
    }, []);

    // Form reservasi meja.
    const [nama, setNama] = useState('');
    const [tanggal, setTanggal] = useState('');
    const [jamReservasi, setJamReservasi] = useState('');
    const [jumlahOrang, setJumlahOrang] = useState('2');
    const [reservasiOk, setReservasiOk] = useState(false);

    const hariIni = useMemo(() => {
        const d = new Date();
        const bln = String(d.getMonth() + 1).padStart(2, '0');
        const tgl = String(d.getDate()).padStart(2, '0');
        return `${d.getFullYear()}-${bln}-${tgl}`;
    }, []);

    const slotJam = ['11.00', '12.00', '13.00', '15.00', '17.00', '18.00', '19.00', '20.00'];

    function kirimReservasi(e: FormEvent) {
        e.preventDefault();
        if (!nama.trim() || !tanggal || !jamReservasi) return;
        setReservasiOk(true);
    }

    const navLinks = [
        { href: '#beranda', label: 'Beranda' },
        { href: '#menu', label: 'Menu' },
        { href: '#galeri', label: 'Galeri' },
        { href: '#reservasi', label: 'Reservasi' },
        { href: '#lokasi', label: 'Lokasi' },
    ];

    return (
        <div className="min-h-screen bg-amber-50/70 pb-24 text-stone-900 md:pb-0">
            {/* Navbar */}
            <header className="sticky top-0 z-40 border-b border-red-900/10 bg-white/95 backdrop-blur">
                <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
                    <a href="#beranda" className="flex items-center gap-2.5">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-700 to-amber-700">
                            <UtensilsCrossed className="h-5 w-5 text-white" />
                        </span>
                        <span className="text-lg font-extrabold tracking-tight sm:text-xl">
                            WARUNG <span className="text-red-800">NUSANTARA</span>
                        </span>
                    </a>
                    <nav className="ml-8 hidden items-center gap-1 lg:flex">
                        {navLinks.map((l) => (
                            <a key={l.href} href={l.href} className="rounded-md px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-red-900/5 hover:text-stone-900">
                                {l.label}
                            </a>
                        ))}
                    </nav>
                    <Button className="ml-auto hidden bg-red-800 hover:bg-red-900 sm:inline-flex" asChild>
                        <a href="#reservasi">Reservasi Meja</a>
                    </Button>
                    <Button variant="ghost" size="icon" className="ml-auto sm:hidden" onClick={() => setMenuBuka((v) => !v)} aria-label="Menu">
                        {menuBuka ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>
                {menuBuka && (
                    <nav className="border-t border-red-900/10 px-4 py-2 lg:hidden">
                        {navLinks.map((l) => (
                            <a key={l.href} href={l.href} onClick={() => setMenuBuka(false)} className="block rounded-md px-3 py-2 text-sm font-medium text-stone-700 hover:bg-red-900/5">
                                {l.label}
                            </a>
                        ))}
                    </nav>
                )}
            </header>

            {/* Hero */}
            <section id="beranda" className="relative overflow-hidden bg-gradient-to-br from-red-800 via-red-900 to-amber-950 text-white">
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 15% 20%, rgba(255,200,120,.18) 0, transparent 45%)' }} aria-hidden />
                <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:py-20 lg:grid-cols-2">
                    <div>
                        <Badge className="mb-4 bg-white/15 text-white hover:bg-white/20">Masakan Indonesia • Jakarta Selatan</Badge>
                        <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                            Rendang Dimasak 8 Jam. <span className="text-amber-300">Nasi Refill Sepuasnya.</span>
                        </h1>
                        <p className="mt-4 max-w-md text-red-100/90">
                            60+ menu khas daerah, Padang, Jawa, Lombok, Bali, dimasak segar tiap hari.
                            Paket lengkap rendang + nasi + es teh mulai Rp45.000.
                        </p>
                        <div className="mt-6 flex flex-wrap items-center gap-4">
                            <Button size="lg" className="bg-amber-500 text-red-950 hover:bg-amber-400" asChild>
                                <a href="#menu">Lihat Menu</a>
                            </Button>
                            <a href="#reservasi" className="text-sm font-semibold text-amber-200 underline-offset-4 hover:underline">
                                atau reservasi meja dulu →
                            </a>
                        </div>
                        <div className="mt-8 flex flex-wrap gap-6 text-sm text-red-100/90">
                            <span className="flex items-center gap-1.5"><Star className="h-4 w-4 fill-amber-300 text-amber-300" /> 4.8 (3.100+ ulasan)</span>
                            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> Buka 10.00–22.00</span>
                            <span className="flex items-center gap-1.5"><UtensilsCrossed className="h-4 w-4" /> 60+ menu</span>
                        </div>
                    </div>
                    <div className="relative mx-auto hidden w-full max-w-md sm:flex lg:max-w-lg">
                        <img src="/images/landing-restoran/hero.jpg" alt="Nasi goreng kampung Warung Nusantara" className="aspect-[4/3] w-full rounded-3xl object-cover shadow-2xl" />
                        <div className="absolute top-4 left-4 rounded-2xl bg-white px-4 py-2 text-xs font-bold text-red-800 shadow-lg">Sambal Dadakan</div>
                        <div className="absolute right-4 bottom-4 rounded-2xl bg-stone-950 px-4 py-2 text-xs font-semibold text-amber-100 shadow-lg">Sejak 2014</div>
                    </div>
                </div>
            </section>

            {/* Statistik */}
            <section className="mx-auto max-w-6xl px-4 py-12">
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {STATS.map((s) => (
                        <Card key={s.label} className="text-center">
                            <CardContent className="p-5">
                                {s.display ? (
                                    <p className="text-3xl font-extrabold text-red-800">{s.display}</p>
                                ) : (
                                    <StatCounter value={s.value} suffix={s.suffix} className="text-3xl font-extrabold text-red-800" />
                                )}
                                <p className="mt-1 text-sm text-stone-600">{s.label}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Menu */}
            <section id="menu" className="mx-auto max-w-6xl px-4 py-10">
                <div className="text-center">
                    <Badge variant="outline" className="border-red-800/30 text-red-800">Menu Kami</Badge>
                    <h2 className="mt-3 text-3xl font-extrabold tracking-tight">Dimasak Segar Setiap Hari</h2>
                    <p className="mx-auto mt-2 max-w-lg text-stone-600">Harga sudah termasuk pajak. Nasi putih refill sepuasnya untuk makan di tempat.</p>
                </div>
                <Tabs value={tabAktif} onValueChange={(v) => setTabAktif(v as typeof tabAktif)} className="mt-8">
                    <TabsList className="mx-auto flex w-full max-w-xl bg-red-900/10">
                        {TAB_MENU.map((t) => (
                            <TabsTrigger key={t.value} value={t.value} className="flex-1 data-[state=active]:bg-white">
                                {t.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    {TAB_MENU.map((t) => (
                        <TabsContent key={t.value} value={t.value}>
                            <div className="grid gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-3">
                                {MENU[t.value].map((m) => (
                                    <Card key={m.nama} className="overflow-hidden transition-shadow hover:shadow-md">
                                        <div className={cn('relative flex h-32 items-center justify-center bg-gradient-to-br', m.art)}>
                                            <m.icon className="h-12 w-12 text-white/85" strokeWidth={1.5} />
                                            {m.andalan && <Badge className="absolute top-2 left-2 bg-amber-500 text-amber-950 hover:bg-amber-500">Andalan</Badge>}
                                        </div>
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between gap-2">
                                                <p className="font-semibold">{m.nama}</p>
                                                <p className="shrink-0 font-bold text-red-800">{rupiah(m.harga)}</p>
                                            </div>
                                            <p className="mt-1 text-sm text-stone-600">{m.deskripsi}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>
            </section>

            {/* Perbandingan: makan di sini vs resto mall */}
            <section className="mx-auto max-w-6xl px-4 pb-14">
                <Card className="overflow-hidden">
                    <CardContent className="p-0">
                        <div className="border-b p-6 sm:p-8">
                            <h2 className="font-display text-2xl font-extrabold tracking-tight">Kenapa Warung, Bukan Resto Mall?</h2>
                            <p className="mt-1 text-sm text-stone-600">Hitungan jujur untuk makan siang berdua.</p>
                        </div>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-1/3"> </TableHead>
                                        <TableHead className="bg-red-800/5 font-bold text-red-800">Warung Nusantara</TableHead>
                                        <TableHead>Resto di mall</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {[
                                        ['Paket lengkap (lauk + nasi + minum)', 'Mulai Rp45.000', 'Rp85.000+'],
                                        ['Refill nasi putih', 'Gratis, sepuasnya', 'Rp15.000 / porsi'],
                                        ['Sambal', 'Dadak-an, 4 varian', 'Sachet'],
                                        ['Parkir rombongan', 'Luas, gratis, muat bus', 'Bayar per jam'],
                                        ['Bisa bawa 20 orang tanpa booking jauh hari', 'Ya, saung lesehan', 'Harus reservasi H-7'],
                                    ].map(([aspek, kami, mereka]) => (
                                        <TableRow key={aspek}>
                                            <TableCell className="font-semibold">{aspek}</TableCell>
                                            <TableCell className="bg-red-800/5 font-semibold text-red-900">{kami}</TableCell>
                                            <TableCell className="text-stone-600">{mereka}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Jam operasional + status live */}
            <section className="mx-auto max-w-6xl px-4 pb-14">
                <Card className="overflow-hidden border-red-900/15">
                    <div className="grid md:grid-cols-2">
                        <CardContent className="p-6 sm:p-8">
                            <div className="flex items-center gap-3">
                                <span className={cn('relative flex h-3.5 w-3.5')}>
                                    <span className={cn('absolute inline-flex h-full w-full animate-ping rounded-full opacity-60', statusResto.buka ? 'bg-green-500' : 'bg-red-500')} />
                                    <span className={cn('relative inline-flex h-3.5 w-3.5 rounded-full', statusResto.buka ? 'bg-green-600' : 'bg-red-600')} />
                                </span>
                                <p className={cn('text-lg font-bold', statusResto.buka ? 'text-green-700' : 'text-red-700')}>
                                    {statusResto.buka ? 'Buka Sekarang' : 'Tutup'}
                                </p>
                            </div>
                            <p className="mt-2 text-sm text-stone-600">
                                {statusResto.buka
                                    ? 'Dapur masih menyala sampai pukul 22.00, yuk makan!'
                                    : 'Kami buka kembali pukul 10.00. Sampai jumpa!'}
                            </p>
                            <div className="mt-5 space-y-2 text-sm">
                                {[
                                    ['Senin, Jumat', '10.00, 22.00'],
                                    ['Sabtu, Minggu', '09.00, 23.00'],
                                ].map(([hari, jam]) => (
                                    <div key={hari} className="flex items-center justify-between border-b border-dashed border-red-900/15 pb-2">
                                        <span className="flex items-center gap-2 text-stone-600"><Clock className="h-4 w-4 text-red-700" />{hari}</span>
                                        <span className="font-semibold">{jam}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                        <div className="relative flex min-h-56 items-center justify-center bg-gradient-to-br from-stone-800 via-red-950 to-black p-8">
                            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(255,180,100,.25) 0, transparent 50%)' }} aria-hidden />
                            <div className="relative text-center text-amber-100">
                                <UtensilsCrossed className="mx-auto h-14 w-14" strokeWidth={1.25} />
                                <p className="mt-3 font-semibold">Paket prasmanan untuk acara</p>
                                <p className="text-sm text-amber-200/80">Mulai Rp45rb/pax • min. 50 pax</p>
                            </div>
                        </div>
                    </div>
                </Card>
            </section>

            {/* Galeri */}
            <section id="galeri" className="bg-stone-950 py-14 text-white">
                <div className="mx-auto max-w-6xl px-4">
                    <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Suasana Warung Nusantara</h2>
                    <p className="mt-1 text-sm text-stone-400">Tempat makan keluarga dengan saung lesehan yang adem.</p>
                    <div className="mt-6 flex gap-4 overflow-x-auto pb-2">
                        {GALERI.map((g) => (
                            <div key={g.judul} className="w-60 shrink-0 overflow-hidden rounded-xl sm:w-72">
                                <img src={g.foto} alt={g.judul} loading="lazy" className="h-40 w-full object-cover sm:h-48" />
                                <p className="bg-stone-900 px-3 py-2.5 text-sm font-medium text-stone-200">{g.judul}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Reservasi */}
            <section id="reservasi" className="mx-auto max-w-6xl px-4 py-14">
                <div className="grid items-start gap-8 lg:grid-cols-2">
                    <div>
                        <Badge variant="outline" className="border-red-800/30 text-red-800">Reservasi Meja</Badge>
                        <h2 className="mt-3 text-3xl font-extrabold tracking-tight">Amankan Mejammu</h2>
                        <p className="mt-2 text-stone-600">
                            Jam makan siang dan malam akhir pekan biasanya penuh, reservasi minimal 3 jam sebelumnya.
                            Grup di atas 10 orang wajib reservasi.
                        </p>
                        <ul className="mt-5 space-y-3 text-sm text-stone-700">
                            {['Saung lesehan untuk 4–20 orang', 'Ruang VIP ber-AC untuk 30 orang', 'Parkir luas untuk bus & mobil'].map((x) => (
                                <li key={x} className="flex items-start gap-2">
                                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-700" /> {x}
                                </li>
                            ))}
                        </ul>
                        <figure className="mt-6 rounded-2xl border-l-4 border-red-700 bg-white p-4 shadow-sm">
                            <blockquote className="text-sm italic text-stone-700">
                                “Buka puasa 120 orang, takjil dan makanan keluar tepat waktu, nggak ada yang
                                antre. Panitia tinggal duduk manis.”
                            </blockquote>
                            <figcaption className="mt-2 text-xs font-semibold text-stone-500">
                                Ibu Rina Marlina, panitia buka bersama warga, April 2026
                            </figcaption>
                        </figure>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Form Reservasi</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {reservasiOk ? (
                                <div className="rounded-xl bg-green-50 p-6 text-center">
                                    <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
                                    <p className="mt-3 text-lg font-bold text-green-800">Reservasi diterima!</p>
                                    <p className="mt-1 text-sm text-green-700">
                                        Terima kasih, <span className="font-semibold">{nama}</span>. Meja untuk {jumlahOrang} orang
                                        pada {tanggal} pukul {jamReservasi} WIB sudah kami catat. Kami tunggu kedatanganmu!
                                    </p>
                                    <Button variant="outline" className="mt-4" onClick={() => { setReservasiOk(false); setNama(''); setTanggal(''); setJamReservasi(''); }}>
                                        Buat reservasi lain
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={kirimReservasi} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="rsv-nama">Nama</Label>
                                        <Input id="rsv-nama" placeholder="cth: Keluarga Hartono" value={nama} onChange={(e) => setNama(e.target.value)} required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="rsv-tanggal">Tanggal</Label>
                                            <Input id="rsv-tanggal" type="date" min={hariIni} value={tanggal} onChange={(e) => setTanggal(e.target.value)} required />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="rsv-jam">Jam</Label>
                                            <Select value={jamReservasi} onValueChange={setJamReservasi} required>
                                                <SelectTrigger id="rsv-jam">
                                                    <SelectValue placeholder="Pilih jam" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {slotJam.map((j) => (
                                                        <SelectItem key={j} value={j}>{j} WIB</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="rsv-orang">Jumlah orang</Label>
                                        <Select value={jumlahOrang} onValueChange={setJumlahOrang}>
                                            <SelectTrigger id="rsv-orang">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {['2', '4', '6', '8', '10', '15', '20+'].map((n) => (
                                                    <SelectItem key={n} value={n}>{n} orang</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button type="submit" className="w-full bg-red-800 hover:bg-red-900">Kirim Reservasi</Button>
                                    <p className="text-center text-xs text-stone-500">Konfirmasi via WhatsApp maksimal 30 menit setelah pengiriman.</p>
                                </form>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Lokasi */}
            <section id="lokasi" className="mx-auto max-w-6xl px-4 pb-16">
                <Card className="overflow-hidden">
                    <div className="grid md:grid-cols-2">
                        <div className="relative min-h-64 bg-gradient-to-br from-amber-100 via-orange-50 to-red-100" aria-hidden>
                            <div className="absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(150,60,30,.08) 0 2px, transparent 2px 40px), repeating-linear-gradient(90deg, rgba(150,60,30,.08) 0 2px, transparent 2px 40px)' }} />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                                <span className="relative mx-auto flex h-14 w-14 items-center justify-center">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-700 opacity-40" />
                                    <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-red-800 shadow-lg">
                                        <MapPin className="h-7 w-7 text-white" />
                                    </span>
                                </span>
                                <p className="mt-2 rounded-full bg-white px-3 py-1 text-xs font-bold shadow">WARUNG NUSANTARA</p>
                            </div>
                        </div>
                        <CardContent className="p-6 sm:p-8">
                            <h2 className="text-2xl font-extrabold tracking-tight">Kunjungi Kami</h2>
                            <div className="mt-4 space-y-3 text-sm text-stone-700">
                                <p className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-red-800" /> Jl. Cipete Raya No. 27, Cilandak, Jakarta Selatan 12410<br />(500 m dari Stasiun MRT Cipete Raya)</p>
                                <p className="flex items-center gap-2"><Phone className="h-4 w-4 shrink-0 text-red-800" /> (021) 7590-3344</p>
                                <p className="flex items-center gap-2"><Clock className="h-4 w-4 shrink-0 text-red-800" /> Setiap hari 10.00–22.00 WIB</p>
                            </div>
                            <Button size="lg" className="mt-6 w-full bg-green-600 hover:bg-green-700 sm:w-auto" asChild>
                                <a href="https://wa.me/6281312345678?text=Halo%20Warung%20Nusantara!%20Saya%20ingin%20reservasi%20meja." target="_blank" rel="noreferrer">
                                    Chat WhatsApp
                                </a>
                            </Button>
                        </CardContent>
                    </div>
                </Card>
            </section>

            {/* Footer */}
            <footer className="bg-stone-950 text-stone-400">
                <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-red-700 to-amber-700">
                                <UtensilsCrossed className="h-4 w-4 text-white" />
                            </span>
                            <span className="text-lg font-extrabold text-white">WARUNG <span className="text-amber-500">NUSANTARA</span></span>
                        </div>
                        <p className="mt-3 text-sm">Cita rasa Nusantara dalam satu meja. Melayani Jakarta sejak 2014.</p>
                    </div>
                    <div>
                        <p className="font-semibold text-white">Jam Operasional</p>
                        <ul className="mt-3 space-y-1.5 text-sm">
                            <li>Senin, Jumat: 10.00, 22.00</li>
                            <li>Sabtu, Minggu: 09.00, 23.00</li>
                        </ul>
                    </div>
                    <div>
                        <p className="font-semibold text-white">Kontak</p>
                        <ul className="mt-3 space-y-1.5 text-sm">
                            <li>Jl. Cipete Raya No. 27, Jaksel</li>
                            <li>(021) 7590-3344</li>
                            <li>WA: 0813-1234-5678</li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-stone-800 py-4 text-center text-xs">© 2026 Warung Nusantara, Jakarta. Selamat menikmati!</div>
            </footer>

            <StickyMobileCta
                variant="whatsapp"
                title="Warung Nusantara"
                subtitle={statusResto.buka ? 'Buka sekarang • s.d. 22.00' : 'Buka kembali 10.00'}
                actionLabel="Reservasi Meja"
            />
        </div>
    );
}
