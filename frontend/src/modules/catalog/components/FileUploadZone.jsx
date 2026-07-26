import { useRef, useState } from 'react';
import { UploadCloud, FileText, X } from 'lucide-react';
import { formatFileSize } from '../utils/catalogHelpers';

export const FileUploadZone = ({ files, onAddFiles, onRemoveFile }) => {
    const inputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFiles = (fileList) => {
        if (fileList?.length) onAddFiles(fileList);
    };

    return (
        <div>
            <div
                role="button"
                tabIndex={0}
                onClick={() => inputRef.current?.click()}
                onKeyDown={(event) => event.key === 'Enter' && inputRef.current?.click()}
                onDragOver={(event) => {
                    event.preventDefault();
                    setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(event) => {
                    event.preventDefault();
                    setIsDragging(false);
                    handleFiles(event.dataTransfer.files);
                }}
                className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition ${
                    isDragging ? 'border-[#be1e2d] bg-[#fdeceb]' : 'border-[#ecd9d3] bg-[#fbf4f2] hover:border-[#be1e2d]'
                }`}
            >
                <UploadCloud size={28} className="text-[#b3791f]" />
                <p className="text-sm font-medium text-slate-700">Arrastra tus archivos aquí o haz clic para elegirlos</p>
                <p className="text-xs text-slate-400">PDF, JPG o PNG</p>

                <input
                    ref={inputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(event) => {
                        handleFiles(event.target.files);
                        event.target.value = '';
                    }}
                />
            </div>

            {files.length > 0 && (
                <ul className="mt-4 space-y-2">
                    {files.map(({ id, file }) => (
                        <li
                            key={id}
                            className="flex items-center justify-between gap-3 rounded-xl border border-[#ecd9d3] bg-white px-4 py-3"
                        >
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#fbf1e6] text-[#b3791f]">
                                    <FileText size={16} />
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-slate-800">{file.name}</p>
                                    <p className="text-xs text-slate-400">{formatFileSize(file.size)}</p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => onRemoveFile(id)}
                                aria-label={`Cancelar carga de ${file.name}`}
                                title="Cancelar carga"
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-[#be1e2d]"
                            >
                                <X size={16} />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
