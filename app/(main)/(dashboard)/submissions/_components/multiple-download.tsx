"use client"

import { Button } from '@/components/ui/button';
import { imageTypes } from '@/lib/image-types';
import { Download } from 'lucide-react';
import React from 'react'

type Props = {
    submission: any;
}

const MultipleDownload = ({ submission }: Props) => {
    const downloadImage = async (url: string, filename: string) => {
        const response = await fetch(url);
        const blob = await response.blob();
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    };


    const downloadAllImages = async () => {
        for (const img of imageTypes) {
            const url = submission[img.key];
            if (url) {
                const filename = `${img.label.replace(/\s+/g, '_').toLowerCase()}.png`;
                await downloadImage(url, filename);
            }
        }
    };

    return (
      <Button variant="outline" size="sm" className="gap-2" onClick={downloadAllImages}>
        <Download className="h-4 w-4" />
          Download All
      </Button>
    )
}

export default MultipleDownload