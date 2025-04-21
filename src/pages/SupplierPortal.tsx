
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const SupplierPortal = () => {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Supplier Portal</h1>
        <p className="text-gray-600">Create and manage special offers for UK Building Merchants</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card>
          <CardHeader>
            <CardTitle>Active Offers</CardTitle>
            <CardDescription>Currently running promotions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12</div>
            <Button variant="link" className="p-0">View all offers</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Retailers</CardTitle>
            <CardDescription>Participating merchants</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">48</div>
            <Button variant="link" className="p-0">View all retailers</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Engagement</CardTitle>
            <CardDescription>Offer views this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2,451</div>
            <Button variant="link" className="p-0">View analytics</Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Offers</CardTitle>
              <CardDescription>Your latest promotional campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="border rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Summer Tool Special {item}</h3>
                      <p className="text-sm text-gray-500">Active until Aug 31, 2025</p>
                    </div>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">Create New Offer</Button>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common supplier tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start">Create New Offer</Button>
              <Button variant="outline" className="w-full justify-start">View Analytics</Button>
              <Button variant="outline" className="w-full justify-start">Manage Retailers</Button>
              <Button variant="outline" className="w-full justify-start">Edit Company Profile</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SupplierPortal;
