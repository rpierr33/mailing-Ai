"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Palette,
  Type,
  Image,
  Minus,
  Square,
  Heading,
  BoxSelect,
  Columns,
  Monitor,
  Smartphone,
  Save,
  Trash2,
  ChevronUp,
  ChevronDown,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import type { Template } from "@/types";

interface Block {
  id: string;
  type: string;
  content?: string;
  bgColor?: string;
  textColor?: string;
  fontSize?: number;
  align?: string;
  label?: string;
  url?: string;
  borderRadius?: number;
  alt?: string;
  width?: number;
  color?: string;
  left?: string;
  right?: string;
  address?: string;
  unsubscribe?: string;
}

const BLOCK_TYPES = [
  { type: "header", label: "Header", icon: Heading },
  { type: "text", label: "Text", icon: Type },
  { type: "button", label: "Button", icon: Square },
  { type: "image", label: "Image", icon: Image },
  { type: "divider", label: "Divider", icon: Minus },
  { type: "columns", label: "2 Column", icon: Columns },
  { type: "footer", label: "Footer", icon: BoxSelect },
];

const DEFAULT_BLOCKS: Record<string, Omit<Block, "id" | "type">> = {
  header: { content: "Your Brand", bgColor: "#4f46e5", textColor: "#ffffff", fontSize: 20 },
  text: { content: "Add your text content here. Click to edit.", fontSize: 14, textColor: "#d1d5db", align: "left" },
  button: { label: "Click Here", url: "#", bgColor: "#6366f1", textColor: "#ffffff", borderRadius: 8 },
  image: { url: "", alt: "Image", width: 100 },
  divider: { color: "#374151" },
  columns: { left: "Left column content", right: "Right column content" },
  footer: { address: "123 Main St, City, State 12345", unsubscribe: "Unsubscribe from these emails" },
};

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [templateName, setTemplateName] = useState("Untitled Template");

  useEffect(() => {
    fetch("/api/campaigns")
      .then(() => {
        // Load templates from API
        setTemplates([
          { id: "tpl1", name: "Welcome", description: "Clean welcome email for new subscribers", blocks: [], category: "onboarding", isPrebuilt: true, createdAt: "", updatedAt: "", userId: null },
          { id: "tpl2", name: "Newsletter", description: "Weekly newsletter layout", blocks: [], category: "newsletter", isPrebuilt: true, createdAt: "", updatedAt: "", userId: null },
          { id: "tpl3", name: "Promo", description: "Sale / discount template", blocks: [], category: "promotion", isPrebuilt: true, createdAt: "", updatedAt: "", userId: null },
          { id: "tpl4", name: "Announcement", description: "Product launch announcement", blocks: [], category: "announcement", isPrebuilt: true, createdAt: "", updatedAt: "", userId: null },
          { id: "tpl5", name: "Minimal", description: "Text-focused simple email", blocks: [], category: "minimal", isPrebuilt: true, createdAt: "", updatedAt: "", userId: null },
          { id: "tpl6", name: "Holiday", description: "Seasonal greetings template", blocks: [], category: "seasonal", isPrebuilt: true, createdAt: "", updatedAt: "", userId: null },
        ]);
        setLoading(false);
      });
  }, []);

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId);

  const addBlock = (type: string) => {
    const newBlock: Block = {
      id: `block-${Date.now()}`,
      type,
      ...DEFAULT_BLOCKS[type],
    };
    setBlocks((prev) => [...prev, newBlock]);
    setSelectedBlockId(newBlock.id);
  };

  const updateBlock = (id: string, props: Partial<Block>) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, ...props } : b)));
  };

  const deleteBlock = (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
    if (selectedBlockId === id) setSelectedBlockId(null);
  };

  const moveBlock = (index: number, direction: number) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= blocks.length) return;
    const newBlocks = [...blocks];
    [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
    setBlocks(newBlocks);
  };

  const gradients = [
    "from-brand-500 to-accent-500",
    "from-emerald-500 to-teal-500",
    "from-amber-500 to-orange-500",
    "from-pink-500 to-rose-500",
    "from-zinc-600 to-zinc-800",
    "from-red-500 to-pink-500",
  ];

  if (editing) {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] -m-4 sm:-m-6">
        {/* Block panel */}
        <div className="w-48 bg-card border-r border-border p-3 overflow-y-auto shrink-0 hidden sm:block">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Blocks
          </p>
          <div className="space-y-1">
            {BLOCK_TYPES.map((bt) => (
              <button
                key={bt.type}
                onClick={() => addBlock(bt.type)}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors cursor-pointer"
              >
                <bt.icon className="w-4 h-4" />
                {bt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 bg-background flex flex-col min-w-0">
          <div className="h-12 bg-card border-b border-border flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setEditing(false)}
                className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="text-sm font-medium text-foreground bg-transparent border-none focus:ring-0 p-0"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-secondary p-0.5 rounded-lg">
                <button
                  onClick={() => setPreviewMode("desktop")}
                  className={`p-1.5 rounded-md cursor-pointer ${
                    previewMode === "desktop"
                      ? "bg-card shadow-sm text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPreviewMode("mobile")}
                  className={`p-1.5 rounded-md cursor-pointer ${
                    previewMode === "mobile"
                      ? "bg-card shadow-sm text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 gradient-bg text-white text-xs font-medium rounded-lg hover:opacity-90 cursor-pointer">
                <Save className="w-3.5 h-3.5" /> Save
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 flex justify-center">
            <div
              className={`bg-card shadow-sm rounded-xl border border-border transition-all ${
                previewMode === "mobile" ? "w-96" : "w-full max-w-xl"
              }`}
            >
              {blocks.length === 0 ? (
                <div className="py-24 text-center">
                  <Type className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Click a block type to start building
                  </p>
                </div>
              ) : (
                blocks.map((block, index) => (
                  <div
                    key={block.id}
                    onClick={() => setSelectedBlockId(block.id)}
                    className={`relative group cursor-pointer transition-all ${
                      selectedBlockId === block.id
                        ? "ring-2 ring-brand-500 ring-inset"
                        : "hover:ring-1 hover:ring-brand-500/30 hover:ring-inset"
                    }`}
                  >
                    <div className="absolute -right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-0.5 z-10">
                      <button
                        onClick={(e) => { e.stopPropagation(); moveBlock(index, -1); }}
                        className="p-0.5 bg-card shadow rounded text-muted-foreground hover:text-foreground cursor-pointer border border-border"
                      >
                        <ChevronUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); moveBlock(index, 1); }}
                        className="p-0.5 bg-card shadow rounded text-muted-foreground hover:text-foreground cursor-pointer border border-border"
                      >
                        <ChevronDown className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteBlock(block.id); }}
                        className="p-0.5 bg-card shadow rounded text-muted-foreground hover:text-red-400 cursor-pointer border border-border"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <BlockPreview block={block} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Properties */}
        <div className="w-64 bg-card border-l border-border p-4 overflow-y-auto shrink-0 hidden md:block">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Properties
          </p>
          {selectedBlock ? (
            <BlockProperties block={selectedBlock} onUpdate={updateBlock} />
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              Select a block to edit
            </p>
          )}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-6xl animate-pulse">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="glass-card rounded-2xl h-52" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {templates.length} templates available
        </p>
        <button
          onClick={() => setEditing(true)}
          className="flex items-center gap-2 px-4 py-2 gradient-bg text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
        >
          <Palette className="w-4 h-4" /> Create Template
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((t, i) => (
          <motion.div
            key={t.id}
            className="glass-card rounded-2xl overflow-hidden hover:border-brand-500/30 transition-colors cursor-pointer group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => {
              setTemplateName(t.name);
              setEditing(true);
            }}
          >
            <div
              className={`h-32 bg-gradient-to-br ${gradients[i % gradients.length]} opacity-80 group-hover:opacity-100 transition-opacity`}
            />
            <div className="p-4">
              <p className="text-sm font-medium text-foreground">{t.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function BlockPreview({ block }: { block: Block }) {
  switch (block.type) {
    case "header":
      return (
        <div
          className="px-6 py-4 rounded-t-xl"
          style={{ backgroundColor: block.bgColor }}
        >
          <p
            className="font-bold"
            style={{ color: block.textColor, fontSize: block.fontSize }}
          >
            {block.content}
          </p>
        </div>
      );
    case "text":
      return (
        <div className="px-6 py-4" style={{ textAlign: block.align as "left" | "center" | "right" }}>
          <p style={{ color: block.textColor, fontSize: block.fontSize }}>
            {block.content}
          </p>
        </div>
      );
    case "button":
      return (
        <div className="px-6 py-4 text-center">
          <span
            className="inline-block px-6 py-2.5 font-medium text-sm"
            style={{
              backgroundColor: block.bgColor,
              color: block.textColor,
              borderRadius: block.borderRadius,
            }}
          >
            {block.label}
          </span>
        </div>
      );
    case "image":
      return (
        <div className="px-6 py-4">
          <div
            className="bg-secondary rounded-lg flex items-center justify-center"
            style={{ width: `${block.width}%`, height: 120 }}
          >
            <Image className="w-8 h-8 text-muted-foreground/30" />
          </div>
        </div>
      );
    case "divider":
      return (
        <div className="px-6 py-2">
          <hr style={{ borderColor: block.color }} />
        </div>
      );
    case "columns":
      return (
        <div className="px-6 py-4 grid grid-cols-2 gap-4">
          <div className="bg-secondary rounded-lg p-3 text-sm text-muted-foreground">
            {block.left}
          </div>
          <div className="bg-secondary rounded-lg p-3 text-sm text-muted-foreground">
            {block.right}
          </div>
        </div>
      );
    case "footer":
      return (
        <div className="px-6 py-4 bg-secondary/50 rounded-b-xl text-center">
          <p className="text-xs text-muted-foreground">{block.address}</p>
          <p className="text-xs text-brand-400 mt-1 underline">
            {block.unsubscribe}
          </p>
        </div>
      );
    default:
      return null;
  }
}

function BlockProperties({
  block,
  onUpdate,
}: {
  block: Block;
  onUpdate: (id: string, props: Partial<Block>) => void;
}) {
  const inputClass =
    "w-full px-2.5 py-1.5 bg-secondary border border-border rounded-lg text-sm text-foreground focus:ring-2 focus:ring-brand-500 focus:border-transparent";
  const labelClass = "block text-xs font-medium text-muted-foreground mb-1";

  return (
    <div className="space-y-3">
      {(block.type === "text" || block.type === "header") && (
        <div>
          <label className={labelClass}>Content</label>
          <textarea
            value={block.content}
            onChange={(e) => onUpdate(block.id, { content: e.target.value })}
            rows={3}
            className={`${inputClass} resize-none`}
          />
        </div>
      )}
      {block.type === "text" && (
        <>
          <div>
            <label className={labelClass}>Font Size</label>
            <input
              type="range"
              min={10}
              max={24}
              value={block.fontSize}
              onChange={(e) => onUpdate(block.id, { fontSize: +e.target.value })}
              className="w-full accent-brand-500"
            />
            <span className="text-xs text-muted-foreground">{block.fontSize}px</span>
          </div>
          <div>
            <label className={labelClass}>Alignment</label>
            <div className="flex gap-1">
              {(["left", "center", "right"] as const).map((a) => (
                <button
                  key={a}
                  onClick={() => onUpdate(block.id, { align: a })}
                  className={`flex-1 py-1 text-xs rounded-lg capitalize cursor-pointer ${
                    block.align === a
                      ? "gradient-bg text-white"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
      {(block.type === "header" || block.type === "button") && (
        <>
          <div>
            <label className={labelClass}>Background</label>
            <input
              type="color"
              value={block.bgColor}
              onChange={(e) => onUpdate(block.id, { bgColor: e.target.value })}
              className="w-full h-8 rounded cursor-pointer"
            />
          </div>
          <div>
            <label className={labelClass}>Text Color</label>
            <input
              type="color"
              value={block.textColor}
              onChange={(e) => onUpdate(block.id, { textColor: e.target.value })}
              className="w-full h-8 rounded cursor-pointer"
            />
          </div>
        </>
      )}
      {block.type === "button" && (
        <>
          <div>
            <label className={labelClass}>Label</label>
            <input
              value={block.label}
              onChange={(e) => onUpdate(block.id, { label: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>URL</label>
            <input
              value={block.url}
              onChange={(e) => onUpdate(block.id, { url: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Corner Radius</label>
            <input
              type="range"
              min={0}
              max={24}
              value={block.borderRadius}
              onChange={(e) => onUpdate(block.id, { borderRadius: +e.target.value })}
              className="w-full accent-brand-500"
            />
          </div>
        </>
      )}
      {block.type === "image" && (
        <>
          <div>
            <label className={labelClass}>Image URL</label>
            <input
              value={block.url}
              onChange={(e) => onUpdate(block.id, { url: e.target.value })}
              placeholder="https://..."
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Width</label>
            <input
              type="range"
              min={20}
              max={100}
              value={block.width}
              onChange={(e) => onUpdate(block.id, { width: +e.target.value })}
              className="w-full accent-brand-500"
            />
            <span className="text-xs text-muted-foreground">{block.width}%</span>
          </div>
        </>
      )}
      {block.type === "footer" && (
        <>
          <div>
            <label className={labelClass}>Address</label>
            <textarea
              value={block.address}
              onChange={(e) => onUpdate(block.id, { address: e.target.value })}
              rows={2}
              className={`${inputClass} resize-none`}
            />
          </div>
          <div>
            <label className={labelClass}>Unsubscribe Text</label>
            <input
              value={block.unsubscribe}
              onChange={(e) => onUpdate(block.id, { unsubscribe: e.target.value })}
              className={inputClass}
            />
          </div>
        </>
      )}
      {block.type === "columns" && (
        <>
          <div>
            <label className={labelClass}>Left Column</label>
            <textarea
              value={block.left}
              onChange={(e) => onUpdate(block.id, { left: e.target.value })}
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>
          <div>
            <label className={labelClass}>Right Column</label>
            <textarea
              value={block.right}
              onChange={(e) => onUpdate(block.id, { right: e.target.value })}
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>
        </>
      )}
    </div>
  );
}
