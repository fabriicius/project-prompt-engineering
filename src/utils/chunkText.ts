export function chunkText(
    text: string, 
    size = 500 , 
    overlap = 100
    ): string[]
{
    const chunks: string[] = [];
    let start = 0;

    while (start < text.length){
        var startandsize =  start + size; 
        const textslice =  text.slice(start, startandsize)
        chunks.push(textslice);
        start += size - overlap;
    }
    return chunks;
}