
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search } from "lucide-react";

const ConsumerApp = () => {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Find Special Offers</h1>
        <p className="text-gray-600">Discover the best deals from building merchants near you</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for products, brands, or categories..."
                className="pl-10"
              />
            </div>
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Enter your location..."
              className="pl-10 w-full md:w-[250px]"
            />
          </div>
          <Button>Search</Button>
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Featured Offers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Card key={item} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-[16/9] bg-gray-100 flex items-center justify-center">
                <img
                  src={`https://picsum.photos/seed/${item}/500/300`}
                  alt={`Product ${item}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle>Premium Power Drill Set {item}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">Supplier XYZ</span>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">25% OFF</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Professional-grade power drill set with multiple attachments and carrying case.
                </p>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <MapPin className="h-4 w-4" />
                  <span>Available at 5 retailers near you</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">View Details</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-6 mb-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Get the Mobile App</h2>
          <p className="text-gray-600 mb-4">Find special offers on the go and get notified about new deals</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button>Download for iOS</Button>
            <Button variant="outline">Download for Android</Button>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Find Retailers Near You</h2>
        <div className="bg-gray-100 rounded-lg h-[400px] flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Interactive map will display here</p>
            <Button>Use My Location</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsumerApp;
