
import React from 'react';
import { CampaignOffer } from '@/hooks/useCampaignOffers';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface CampaignOffersListProps {
  offers: CampaignOffer[];
  onSelect: (offer: CampaignOffer) => void;
  onDelete: (offerId: string) => void;
  isDeleting: boolean;
}

export const CampaignOffersList: React.FC<CampaignOffersListProps> = ({
  offers,
  onSelect,
  onDelete,
  isDeleting,
}) => {
  if (offers.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No offers added to this campaign yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {offers.map((offer) => (
        <Card key={offer.id} className="flex flex-col overflow-hidden">
          <div className="h-48 bg-gray-100 relative">
            {offer.media && offer.media.length > 0 ? (
              offer.media[0].media_type === 'image' ? (
                <img
                  src={offer.media[0].url}
                  alt={offer.product_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  src={offer.media[0].url}
                  className="w-full h-full object-cover"
                  controls
                />
              )
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No image
              </div>
            )}
            <Badge className="absolute top-2 right-2 bg-blue-600">
              {Math.round(((offer.regular_price - offer.offer_price) / offer.regular_price) * 100)}% Off
            </Badge>
          </div>
          
          <CardContent className="flex-grow pt-4">
            <h3 className="font-semibold text-lg line-clamp-1">{offer.title}</h3>
            <p className="text-sm text-gray-500 mb-1">Code: {offer.product_code}</p>
            <p className="text-sm text-gray-500 mb-2">
              {offer.supplier_name ? `Supplier: ${offer.supplier_name}` : 'No supplier'}
            </p>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-bold text-lg">£{offer.offer_price.toFixed(2)}</span>
              <span className="text-sm text-gray-500 line-through">£{offer.regular_price.toFixed(2)}</span>
            </div>
            <p className="text-sm line-clamp-2">{offer.description}</p>
          </CardContent>
          
          <CardFooter className="border-t pt-3">
            <div className="flex justify-between w-full">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onSelect(offer)}
              >
                <Pencil className="h-4 w-4 mr-1" />
                Edit
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Offer</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this offer? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDelete(offer.id)}
                      disabled={isDeleting}
                    >
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
