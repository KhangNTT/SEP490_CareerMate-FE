'use client';

import { useState } from 'react';
import { CV_TEMPLATES, type CVTemplate } from '@/types/cv';
import { Check, Image } from 'lucide-react';

interface Props {
  onTemplateSelect?: (templateId: string) => void;
}

export default function CVTemplateSelector({ onTemplateSelect }: Props) {
  const [selectedTemplate, setSelectedTemplate] = useState('minimalist');

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    onTemplateSelect?.(templateId);
  };

  // Tạo preview cho mỗi template với hình ảnh thật từ thư mục cvtemp
  const getTemplatePreview = (template: CVTemplate) => {
    return (
      <div className="relative w-full aspect-[3/4] bg-white rounded-lg overflow-hidden group hover:shadow-lg transition-all duration-200 border border-gray-100">
        {/* Hiển thị hình ảnh template từ thư mục cvtemp */}
        <div className="w-full h-full bg-white flex flex-col items-center justify-center">
          <div className="w-full h-full relative">
            <img 
              src={template.previewImage || `/images/cvtemp/${template.id}.png`} 
              alt={`${template.name} template`} 
              className="w-full h-full object-contain"
              onError={(e) => {
                // Fallback to category name if exact ID image doesn't exist
                (e.target as HTMLImageElement).src = `/images/cvtemp/${template.category}.png`;
              }}
            />
          </div>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 group-hover:bg-black group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-white rounded-full p-3 shadow-lg">
              {selectedTemplate === template.id ? (
                <Check className="w-6 h-6 text-[#00ec2f]" />
              ) : (
                <Image className="w-6 h-6 text-gray-400" />
              )}
            </div>
          </div>
        </div>

        {/* Selection indicator */}
        {selectedTemplate === template.id && (
          <div className="absolute top-3 right-3 bg-[#00ec2f] w-6 h-6 rounded-full flex items-center justify-center shadow-md">
            <Check className="w-4 h-4 text-white" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full bg-gradient-to-br from-[#667085] via-white-900 to-[#f8f8f8] flex flex-col">
      {/* Sticky Header */}
      
      
      {/* Scrollable Content */}
      <div className="flex-1 mt overflow-y-auto p-6">
        <div className="grid grid-cols-2 gap-4">
          {CV_TEMPLATES.map((template) => (
            <div key={template.id} className="space-y-3">
              {/* Template Preview Card */}
              <div
                onClick={() => handleSelectTemplate(template.id)}
                className={`
                  cursor-pointer transition-all duration-200 hover:scale-105
                  ${selectedTemplate === template.id ? 'ring-2 ring-[#00ec2f] ring-offset-2 rounded-lg' : ''}
                `}
              >
                {getTemplatePreview(template)}
              </div>
              
              {/* Template Info */}
              <div className="space-y-2">
                <div className="text-center">
                  <h3 className="font-semibold text-gray-800 text-sm">{template.name}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}