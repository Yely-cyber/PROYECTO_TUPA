import { Search } from 'lucide-react';

export const SearchBar = ({ value, onChange, placeholder = 'Buscar trámite...' }) => (
	<div className="relative">
		<Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
		<input
			type="text"
			value={value}
			onChange={(event) => onChange(event.target.value)}
			placeholder={placeholder}
			className="w-full rounded-xl border border-[#ecd9d3] bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#be1e2d] focus:ring-4 focus:ring-[#be1e2d]/10"
		/>
	</div>
);
