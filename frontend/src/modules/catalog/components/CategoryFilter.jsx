import { SlidersHorizontal } from 'lucide-react';

const TODOS_VALUE = 'TODOS';

export const CategoryFilter = ({ categories, value, onChange }) => (
	<div className="relative">
		<SlidersHorizontal
			size={16}
			className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
		/>
		<select
			value={value}
			onChange={(event) => onChange(event.target.value)}
			className="w-full appearance-none rounded-xl border border-[#ecd9d3] bg-white py-2.5 pl-10 pr-8 text-sm text-slate-700 outline-none transition focus:border-[#be1e2d] focus:ring-4 focus:ring-[#be1e2d]/10 sm:w-72"
		>
			<option value={TODOS_VALUE}>Todas las categorías</option>
			{categories.map((category) => (
				<option key={category} value={category}>
					{category}
				</option>
			))}
		</select>
	</div>
);
