"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Card } from "@/components/ui/Card";
import {
    Camera,
    X,
    Package,
    DollarSign,
    FileText,
    Tag,
    Sparkles,
    ArrowRight,
    ArrowLeft,
    Check,
    Clock,
    Calendar,
    AlertCircle
} from "lucide-react";

const categories = [
    { value: "books", label: "📚 Books & Textbooks" },
    { value: "electronics", label: "💻 Electronics" },
    { value: "clothing", label: "👕 Clothing & Accessories" },
    { value: "furniture", label: "🪑 Furniture" },
    { value: "sports", label: "⚽ Sports & Fitness" },
    { value: "stationery", label: "✏️ Stationery" },
    { value: "accessories", label: "👜 Bags & Accessories" },
    { value: "other", label: "📦 Other" },
];

const conditions = [
    { value: "new", label: "New - Never used, with tags" },
    { value: "like-new", label: "Like New - Used once or twice" },
    { value: "good", label: "Good - Some signs of use" },
    { value: "fair", label: "Fair - Visible wear but works fine" },
];

const weekdays = [
    { value: "monday", label: "Mon" },
    { value: "tuesday", label: "Tue" },
    { value: "wednesday", label: "Wed" },
    { value: "thursday", label: "Thu" },
    { value: "friday", label: "Fri" },
    { value: "saturday", label: "Sat" },
    { value: "sunday", label: "Sun" },
];

interface College {
    _id: string;
    name: string;
    shortCode: string;
}

export default function SellPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [colleges, setColleges] = useState<College[]>([]);
    const [images, setImages] = useState<string[]>([]);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        condition: "",
        price: "",
        college: "",
        availableDays: [] as string[],
        availableTimeStart: "",
        availableTimeEnd: "",
        availableNote: "",
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login?redirect=/sell");
            return;
        }

        fetch("/api/colleges")
            .then((res) => res.json())
            .then((data) => setColleges(data.colleges || []))
            .catch(console.error);

        const user = localStorage.getItem("user");
        if (user) {
            const userData = JSON.parse(user);
            if (userData.college?._id) {
                setFormData(prev => ({ ...prev, college: userData.college._id }));
            }
        }
    }, [router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const toggleDay = (day: string) => {
        setFormData(prev => ({
            ...prev,
            availableDays: prev.availableDays.includes(day)
                ? prev.availableDays.filter(d => d !== day)
                : [...prev.availableDays, day]
        }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        Array.from(files).forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result && images.length < 5) {
                    setImages(prev => [...prev, reader.result as string]);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                    images,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to create listing");
            }

            router.push(`/product/${data.product._id}?created=true`);
        } catch (error) {
            console.error("Error creating listing:", error);
            alert("Failed to create listing. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const canProceed = () => {
        switch (step) {
            case 1: return formData.category && formData.condition;
            case 2: return formData.title && formData.description && formData.price;
            case 3: return formData.availableDays.length > 0 && formData.availableTimeStart && formData.availableTimeEnd;
            case 4: return formData.college;
            default: return false;
        }
    };

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-2">Sell Your Item</h1>
                    <p className="text-muted-foreground">
                        List your item in just a few steps
                    </p>
                </div>

                {/* Progress steps */}
                <div className="flex items-center justify-center gap-3 mb-12">
                    {[1, 2, 3, 4].map((s, index) => (
                        <React.Fragment key={s}>
                            <button
                                onClick={() => s < step && setStep(s)}
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${s === step
                                    ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white glow"
                                    : s < step
                                        ? "bg-emerald-500 text-white"
                                        : "bg-muted text-muted-foreground"
                                    }`}
                            >
                                {s < step ? <Check size={18} /> : s}
                            </button>
                            {index < 3 && (
                                <div className={`w-12 sm:w-16 h-1 rounded-full ${s < step ? "bg-emerald-500" : "bg-muted"}`} />
                            )}
                        </React.Fragment>
                    ))}
                </div>

                <Card variant="glass" className="p-6 sm:p-8">
                    {/* Step 1: Category & Condition */}
                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center mb-4">
                                    <Tag size={32} className="text-white" />
                                </div>
                                <h2 className="text-xl font-semibold">What are you selling?</h2>
                                <p className="text-muted-foreground mt-1">Select a category and condition</p>
                            </div>

                            <Select
                                label="Category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                options={[{ value: "", label: "Select a category" }, ...categories]}
                            />

                            <Select
                                label="Condition"
                                name="condition"
                                value={formData.condition}
                                onChange={handleChange}
                                options={[{ value: "", label: "Select condition" }, ...conditions]}
                            />
                        </div>
                    )}

                    {/* Step 2: Details */}
                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center mb-4">
                                    <FileText size={32} className="text-white" />
                                </div>
                                <h2 className="text-xl font-semibold">Add Details</h2>
                                <p className="text-muted-foreground mt-1">Describe your item to attract buyers</p>
                            </div>

                            {/* Image upload */}
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-2">
                                    Photos (up to 5)
                                </label>
                                <div className="grid grid-cols-5 gap-3">
                                    {images.map((img, index) => (
                                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                            <button
                                                onClick={() => removeImage(index)}
                                                className="absolute top-1 right-1 p-1 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                                            >
                                                <X size={14} className="text-white" />
                                            </button>
                                        </div>
                                    ))}
                                    {images.length < 5 && (
                                        <label className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary flex flex-col items-center justify-center cursor-pointer transition-colors">
                                            <Camera size={24} className="text-muted-foreground mb-1" />
                                            <span className="text-xs text-muted-foreground">Add</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={handleImageUpload}
                                                className="hidden"
                                            />
                                        </label>
                                    )}
                                </div>
                            </div>

                            <Input
                                label="Title"
                                name="title"
                                placeholder="e.g., Engineering Mathematics Textbook"
                                value={formData.title}
                                onChange={handleChange}
                                icon={<Package size={18} />}
                            />

                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    placeholder="Describe your item in detail. Include brand, size, any defects, etc."
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full bg-input border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                            </div>

                            <Input
                                label="Price (₹)"
                                name="price"
                                type="number"
                                placeholder="Enter your asking price"
                                value={formData.price}
                                onChange={handleChange}
                                icon={<DollarSign size={18} />}
                            />

                            {formData.price && (
                                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                                    <div className="flex items-start gap-2">
                                        <AlertCircle size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
                                        <div className="text-sm">
                                            <p className="text-amber-200">
                                                You'll receive <span className="font-semibold text-emerald-400">₹{Math.round(parseFloat(formData.price) * 0.95).toLocaleString()}</span> after 5% platform fee
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                CampusMarket charges 5% from sellers. Adjust your price accordingly.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 3: Availability */}
                    {step === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mb-4">
                                    <Calendar size={32} className="text-white" />
                                </div>
                                <h2 className="text-xl font-semibold">When are you available?</h2>
                                <p className="text-muted-foreground mt-1">Let buyers know when you can meet for delivery</p>
                            </div>

                            {/* Days selection */}
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-3">
                                    Available Days
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {weekdays.map((day) => (
                                        <button
                                            key={day.value}
                                            type="button"
                                            onClick={() => toggleDay(day.value)}
                                            className={`px-4 py-2 rounded-lg font-medium transition-all ${formData.availableDays.includes(day.value)
                                                ? "bg-primary text-white"
                                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                                                }`}
                                        >
                                            {day.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Time range */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                                        From
                                    </label>
                                    <div className="relative">
                                        <Clock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        <input
                                            type="time"
                                            name="availableTimeStart"
                                            value={formData.availableTimeStart}
                                            onChange={handleChange}
                                            className="w-full bg-input border border-border rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-primary"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                                        To
                                    </label>
                                    <div className="relative">
                                        <Clock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        <input
                                            type="time"
                                            name="availableTimeEnd"
                                            value={formData.availableTimeEnd}
                                            onChange={handleChange}
                                            className="w-full bg-input border border-border rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-primary"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Note */}
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                                    Additional Note (optional)
                                </label>
                                <input
                                    type="text"
                                    name="availableNote"
                                    value={formData.availableNote}
                                    onChange={handleChange}
                                    placeholder="e.g., Free after 3rd lecture, or only during lunch break"
                                    className="w-full bg-input border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
                                    maxLength={200}
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 4: College & Preview */}
                    {step === 4 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-4">
                                    <Sparkles size={32} className="text-white" />
                                </div>
                                <h2 className="text-xl font-semibold">Almost Done!</h2>
                                <p className="text-muted-foreground mt-1">Select your college to list the item</p>
                            </div>

                            <Select
                                label="College"
                                name="college"
                                value={formData.college}
                                onChange={handleChange}
                                options={[
                                    { value: "", label: "Select your college" },
                                    ...colleges.map(c => ({ value: c._id, label: `${c.name} (${c.shortCode})` }))
                                ]}
                            />

                            {/* Preview */}
                            <div className="mt-8 p-6 rounded-xl bg-muted/30 border border-border">
                                <h3 className="font-semibold mb-4">Listing Preview</h3>
                                <div className="flex gap-4">
                                    <div className="w-24 h-24 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                                        {images[0] ? (
                                            <img src={images[0]} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <Package size={32} className="text-muted-foreground" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium">{formData.title || "Your Item Title"}</h4>
                                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                            {formData.description || "Item description..."}
                                        </p>
                                        <div className="flex items-center gap-3 mt-2">
                                            <span className="price-tag">₹{formData.price || "0"}</span>
                                            <span className="badge badge-primary">{formData.condition}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Availability preview */}
                                {formData.availableDays.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-border">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Calendar size={14} className="text-primary" />
                                            <span className="text-muted-foreground">Available:</span>
                                            <span>{formData.availableDays.map(d => d.slice(0, 3)).join(", ")}</span>
                                            <span className="text-muted-foreground">|</span>
                                            <span>{formData.availableTimeStart} - {formData.availableTimeEnd}</span>
                                        </div>
                                        {formData.availableNote && (
                                            <p className="text-xs text-muted-foreground mt-1">"{formData.availableNote}"</p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Fee disclaimer */}
                            <p className="text-xs text-muted-foreground text-center">
                                By listing, you agree to CampusMarket's terms. A 5% platform fee will be deducted from the sale price.
                            </p>
                        </div>
                    )}

                    {/* Navigation */}
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                        {step > 1 ? (
                            <Button variant="ghost" onClick={() => setStep(step - 1)} icon={<ArrowLeft size={18} />}>
                                Back
                            </Button>
                        ) : (
                            <div />
                        )}

                        {step < 4 ? (
                            <Button
                                variant="primary"
                                onClick={() => setStep(step + 1)}
                                disabled={!canProceed()}
                                icon={<ArrowRight size={18} />}
                            >
                                Continue
                            </Button>
                        ) : (
                            <Button
                                variant="accent"
                                onClick={handleSubmit}
                                disabled={!canProceed() || loading}
                                loading={loading}
                                icon={<Sparkles size={18} />}
                            >
                                List Item
                            </Button>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}
