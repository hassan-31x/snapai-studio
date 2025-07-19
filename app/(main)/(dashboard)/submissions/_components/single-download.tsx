"use client"

import React from 'react'
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

type Props = {
  url: string;
  filename: string;
  img: any;
}

const SingleDownload = ({ url, filename, img }: Props) => {
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

  return (
    <a
      href={url}
      download={`${img.label.replace(/\s+/g, '_').toLowerCase()}.png`}
      onClick={async (e) => {
        e.preventDefault();
        await downloadImage(url, `${img.label.replace(/\s+/g, '_').toLowerCase()}.png`);
      }}
    >
      <Button variant="secondary" size="sm" className="mb-4 gap-1.5">
        <Download className="h-3.5 w-3.5" />
        Download
      </Button>
    </a>
  )
}

export default SingleDownload