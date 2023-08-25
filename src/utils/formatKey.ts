export default (e: KeyboardEvent) => {
    const key = e.key
    if (key === 'Control' || key === 'Shift' || key === 'Alt' || key === 'Meta' 
        || key === 'Tab' || key === 'Escape' || key === 'Delete' || key === 'Insert' 
        || key === 'Home' || key === 'End' || key === 'PageUp' || key === 'PageDown' 
        || key === 'CapsLock'
    ){
        return
    }
    if (key.length > 1 && key.includes('F')) return 
    return key
}