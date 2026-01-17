import React, { useState } from 'react'
import { Listbox } from '@headlessui/react'
import { IconChevronDown, IconCircle, IconCircleFilled } from '@tabler/icons-react'

export default function InputSelect({ 
    selected, 
    data, 
    setSelected, 
    label, 
    errors, 
    placeholder, 
    multiple = false, 
    searchable = false, 
    displayKey = 'name' 
}) {
    const [search, setSearch] = useState('')
    const filteredData = data.filter(item =>
        item[displayKey]?.toLowerCase().includes(search.toLowerCase())
    )
    
    return (
        <div className='flex flex-col gap-2'>
            {label && (
                <label className='block text-sm font-medium text-slate-700 dark:text-slate-300'>
                    {label}
                </label>
            )}
            <Listbox value={selected} onChange={setSelected} multiple={multiple} by="id">
                {({ open }) => (
                    <div className="relative">
                        <Listbox.Button className='w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all flex justify-between items-center gap-2 text-sm'>
                            <span className={!selected || (multiple && selected.length === 0) ? 'text-slate-400' : ''}>
                                {multiple ? (
                                    selected.length > 0 ? selected.map(item => item[displayKey]).join(', ') : placeholder
                                ) : (
                                    selected ? selected[displayKey] : placeholder
                                )}
                            </span>
                            <IconChevronDown 
                                size={18} 
                                strokeWidth={1.5} 
                                className={`transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`}
                            />
                        </Listbox.Button>
                        <Listbox.Options className='absolute left-0 right-0 mt-1 p-3 border rounded-xl flex flex-col gap-2 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 z-50 max-h-60 overflow-y-auto shadow-lg'>
                            {searchable && (
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search..."
                                    className="w-full px-3 py-2 mb-1 text-sm border rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                                />
                            )}
                            {filteredData.map((item) => (
                                <Listbox.Option key={item.id} value={item}>
                                    {({ selected }) => (
                                        <div className='text-sm cursor-pointer px-3 py-2 rounded-lg flex items-center gap-2 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors'>
                                            {selected ? (
                                                <IconCircleFilled size={16} strokeWidth={1.5} className='text-primary-500 flex-shrink-0' />
                                            ) : (
                                                <IconCircle size={16} strokeWidth={1.5} className='flex-shrink-0' />
                                            )}
                                            <span className="truncate">{item[displayKey]}</span>
                                        </div>
                                    )}
                                </Listbox.Option>
                            ))}
                            {filteredData.length === 0 && (
                                <div className="text-sm text-slate-400 dark:text-slate-500 text-center py-4">
                                    Tidak ada data
                                </div>
                            )}
                        </Listbox.Options>
                    </div>
                )}
            </Listbox>
            {errors && (
                <small className='text-xs text-red-500'>{errors}</small>
            )}
        </div>
    )
}