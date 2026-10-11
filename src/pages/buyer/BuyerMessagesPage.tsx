import React from 'react';
import { SupportDeskInlineBox } from '../../components/common/SupportChatWidget';

interface BuyerMessagesPageProps {
  onNavigate?: (view: string, params?: any) => void;
}

export const BuyerMessagesPage: React.FC<BuyerMessagesPageProps> = () => {
  return (
    <div className="space-y-4">
      <SupportDeskInlineBox />
    </div>
  );
};