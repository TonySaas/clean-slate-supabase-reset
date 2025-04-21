
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight, Building, MapPin, Search, ShoppingBag, User, Users } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                Connecting Building Merchants with Suppliers and Consumers
              </h1>
              <p className="text-lg text-gray-700 mb-8">
                Modernize your promotions, increase visibility, and drive sales with our digital platform
                for the UK Building Merchant sector.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Supplier Login
                </Button>
                <Button size="lg" variant="outline" className="border-blue-600 text-blue-600">
                  Retailer Login
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" 
                alt="Building Merchant Platform" 
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* User Segments Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            A Platform for Everyone in the Building Supply Chain
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <User className="h-12 w-12 text-blue-600 mb-2" />
                <CardTitle>Tool Suppliers</CardTitle>
                <CardDescription>Create and manage special offers with ease</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Streamlined offer creation</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Performance tracking</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Reduced time-to-market</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Learn More</Button>
              </CardFooter>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Building className="h-12 w-12 text-blue-600 mb-2" />
                <CardTitle>Retailers & Merchants</CardTitle>
                <CardDescription>Display offers and drive local traffic</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Easy website integration</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Inventory management</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Customer communication tools</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Learn More</Button>
              </CardFooter>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-blue-600 mb-2" />
                <CardTitle>Consumers</CardTitle>
                <CardDescription>Find deals, locate retailers, get product info</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Easy offer discovery</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Retailer location finder</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Detailed product information</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Learn More</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Core Platform Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="rounded-full bg-blue-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                <ShoppingBag className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Offer Management</h3>
              <p className="text-gray-600">
                Create, update, and monitor special offers with rich media support
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="rounded-full bg-blue-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Retailer Locator</h3>
              <p className="text-gray-600">
                Location-based discovery to find retailers offering specific promotions
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="rounded-full bg-blue-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Personalization</h3>
              <p className="text-gray-600">
                Tailored offer recommendations based on user preferences and behavior
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="rounded-full bg-blue-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Analytics Dashboard</h3>
              <p className="text-gray-600">
                Comprehensive insights into offer performance and consumer engagement
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Building Supply Chain?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join our platform and start connecting suppliers, retailers, and consumers 
            in a modern, digital ecosystem.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              Request Demo
            </Button>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white text-lg font-bold mb-4">Building Merchant Platform</h3>
              <p className="mb-4">
                Connecting tool suppliers, retailers, and consumers through special offers.
              </p>
            </div>
            <div>
              <h4 className="text-white text-md font-semibold mb-4">For Suppliers</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Supplier Portal</a></li>
                <li><a href="#" className="hover:text-white">Offer Creation</a></li>
                <li><a href="#" className="hover:text-white">Analytics</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-md font-semibold mb-4">For Retailers</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Retailer Portal</a></li>
                <li><a href="#" className="hover:text-white">Website Integration</a></li>
                <li><a href="#" className="hover:text-white">Inventory Management</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-md font-semibold mb-4">For Consumers</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Find Offers</a></li>
                <li><a href="#" className="hover:text-white">Locate Retailers</a></li>
                <li><a href="#" className="hover:text-white">Product Information</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p>&copy; {new Date().getFullYear()} Building Merchant Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
