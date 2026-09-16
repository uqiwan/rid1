import React, { useState } from 'react';
import { User as UserIcon } from 'lucide-react';
import { User } from '../../types';

interface UserAvatarProps {
  user: User | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showStatus?: boolean;
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  size = 'md',
  showStatus = false,
  className = ''
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-20 h-20 text-2xl font-bold'
  };

  const statusSize = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4'
  };

  const name = user?.name || 'Kreator';
  const initial = name.charAt(0).toUpperCase() || 'K';

  // Deterministic pleasant gradient based on name
  const gradientClass = 'bg-linear-to-br from-amber-500 to-amber-700 text-white font-bold';

  const hasValidImage = user?.avatarUrl && !imgError && user.avatarUrl.trim().length > 0;

  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      {hasValidImage ? (
        <img
          src={user.avatarUrl}
          alt={name}
          onError={() => setImgError(true)}
          referrerPolicy="no-referrer"
          loading="eager"
          className={`${sizeClasses[size]} rounded-full object-cover border border-amber-400/40 shadow-xs`}
        />
      ) : (
        <div
          className={`${sizeClasses[size]} rounded-full ${gradientClass} flex items-center justify-center border border-amber-400/50 shadow-xs select-none`}
          title={name}
        >
          {initial ? <span>{initial}</span> : <UserIcon className="w-1/2 h-1/2 text-white" />}
        </div>
      )}

      {showStatus && (
        <span
          title="Akun Siap Digunakan (Terverifikasi)"
          className={`absolute bottom-0 right-0 ${statusSize[size]} rounded-full bg-emerald-500 border-2 border-slate-900 shadow-xs`}
        />
      )}
    </div>
  );
};
