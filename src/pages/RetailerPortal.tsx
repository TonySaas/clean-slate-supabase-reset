
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const RetailerPortal = () => {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Retailer Portal</h1>
        <p className="text-gray-600">Manage offers and drive traffic to your store</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card>
          <CardHeader>
            <CardTitle>Available Offers</CardTitle>
            <CardDescription>Offers you can select</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24</div>
            <Button variant="link" className="p-0">Browse offers</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Offers</CardTitle>
            <CardDescription>Your selected offers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8</div>
            <Button variant="link" className="p-0">Manage active offers</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Store Traffic</CardTitle>
            <CardDescription>Customers this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">142</div>
            <Button variant="link" className="p-0">View analytics</Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Your Active Offers</CardTitle>
              <CardDescription>Promotions currently available at your store</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="border rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Premium Power Tools {item}</h3>
                      <p className="text-sm text-gray-500">From Supplier XYZ</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">View Details</Button>
                      <Button variant="outline" size="sm" className="text-red-500">Remove</Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">Browse More Offers</Button>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Website Integration</CardTitle>
              <CardDescription>Display offers on your site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">Generate a widget to embed on your website to showcase your active offers.</p>
              <Button className="w-full">Generate Widget Code</Button>
              <Button variant="outline" className="w-full">Preview Widget</Button>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common retailer tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start">Browse Available Offers</Button>
              <Button variant="outline" className="w-full justify-start">Update Store Information</Button>
              <Button variant="outline" className="w-full justify-start">Manage Inventory</Button>
              <Button variant="outline" className="w-full justify-start">View Customer Insights</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RetailerPortal;
