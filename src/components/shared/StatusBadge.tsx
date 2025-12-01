/**
 * Enhanced Status Badge Component
 * Displays job application status with 13-status support, icons, and tooltips
 */

import React from 'react';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Eye,
  Clock,
  Calendar,
  CheckCircle,
  ThumbsUp,
  XCircle,
  Briefcase,
  AlertTriangle,
  Flag,
  Undo2,
  Ban,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { JobApplicationStatus } from '@/types/status';
import {
  getStatusConfig,
  getStatusHelpText,
  normalizeStatus,
} from '@/lib/status-utils';

interface StatusBadgeProps {
  status: JobApplicationStatus | string;
  withIcon?: boolean;
  showTooltip?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const iconMap = {
  FileText,
  Eye,
  Clock,
  Calendar,
  CheckCircle,
  ThumbsUp,
  XCircle,
  Briefcase,
  AlertTriangle,
  Flag,
  Undo2,
  Ban,
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  withIcon = false,
  showTooltip = false,
  size = 'md',
  className = '',
}) => {
  // Normalize status (convert ACCEPTED to WORKING)
  const normalizedStatus = normalizeStatus(status as string);
  const config = getStatusConfig(normalizedStatus);
  const helpText = getStatusHelpText(normalizedStatus);

  // Get icon component
  const IconComponent = iconMap[config.lucideIcon as keyof typeof iconMap];

  // Size classes
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  // Badge content
  const badgeContent = (
    <div className="flex items-center gap-1.5">
      {withIcon && IconComponent && (
        <IconComponent size={iconSizes[size]} className="flex-shrink-0" />
      )}
      <span className="font-medium">{config.text}</span>
    </div>
  );

  // Badge with custom styling
  const badge = (
    <Badge
      className={`
        ${config.bgColor} 
        ${config.color} 
        border 
        ${config.borderColor}
        ${sizeClasses[size]}
        ${className}
      `}
      variant="outline"
    >
      {badgeContent}
    </Badge>
  );

  // Wrap with tooltip if enabled
  if (showTooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{badge}</TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs text-sm">{helpText}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return badge;
};

/**
 * Status Badge with Icon (convenience component)
 */
export const StatusBadgeWithIcon: React.FC<Omit<StatusBadgeProps, 'withIcon'>> = (props) => {
  return <StatusBadge {...props} withIcon={true} />;
};

/**
 * Status Badge with Tooltip (convenience component)
 */
export const StatusBadgeWithTooltip: React.FC<Omit<StatusBadgeProps, 'showTooltip'>> = (props) => {
  return <StatusBadge {...props} showTooltip={true} />;
};

/**
 * Status Badge with Icon and Tooltip (convenience component)
 */
export const StatusBadgeFull: React.FC<Omit<StatusBadgeProps, 'withIcon' | 'showTooltip'>> = (
  props
) => {
  return <StatusBadge {...props} withIcon={true} showTooltip={true} />;
};

export default StatusBadge;
