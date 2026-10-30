import React, { useState, useEffect } from "react";
import { Save, Settings as SettingsIcon, FileText, CheckCircle2 } from "lucide-react";
import { LiveInvoicePreview } from "../components/LiveInvoicePreview";
import { settingsService } from "../services/settingsService";
import { SystemSettings } from "../../../types";

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"governance" | "bill_studio">("bill_studio");
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await settingsService.getSettings();
      setSettings(data);
    } catch (err) {
      console.error("Failed to load settings", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      setIsSaving(true);
      const updated = await settingsService.updateSettings(settings);
      setSettings(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err: any) {
      alert(`Failed to save settings: ${err.message || err}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="py-20 text-center text-secondary font-mono text-xs">
        Loading system governance parameters...
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full gap-space-lg">
      {/* Header & Tabs */}
      <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("bill_studio")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
              activeTab === "bill_studio"
                ? "bg-primary-container text-white border-primary"
                : "bg-surface-container-low text-slate-700 border-slate-200/60 hover:bg-surface-container"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Bill Customization Studio</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("governance")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
              activeTab === "governance"
                ? "bg-primary-container text-white border-primary"
                : "bg-surface-container-low text-slate-700 border-slate-200/60 hover:bg-surface-container"
            }`}
          >
            <SettingsIcon className="w-3.5 h-3.5" />
            <span>System Governance & Branch</span>
          </button>
        </div>

        {saveSuccess && (
          <div className="flex items-center gap-1 text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" />
            <span>Changes Saved Successfully!</span>
          </div>
        )}
      </div>

      {activeTab === "bill_studio" ? (
        /* Bill Customization Studio: Form on Left, Live Preview on Right */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
          {/* Left Form (7 cols) */}
          <form
            onSubmit={handleSave}
            className="lg:col-span-7 bg-surface-container-lowest p-space-xl rounded-xl shadow-sm border border-slate-200/70 flex flex-col gap-4"
          >
            <div>
              <span className="font-label-badge text-label-badge text-secondary uppercase tracking-wider block">
                Brand & Terminal Identity
              </span>
              <h3 className="font-headline-sm text-headline-sm font-semibold text-slate-900 mt-0.5">
                Printed Invoice Parameters
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-mono text-[11px] text-slate-600 uppercase block font-semibold mb-1">
                  Enterprise Name *
                </label>
                <input
                  type="text"
                  required
                  value={settings.store_name}
                  onChange={(e) =>
                    setSettings({ ...settings, store_name: e.target.value })
                  }
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded px-2.5 py-2 font-medium"
                />
              </div>

              <div>
                <label className="font-mono text-[11px] text-slate-600 uppercase block font-semibold mb-1">
                  Branch Identity *
                </label>
                <input
                  type="text"
                  required
                  value={settings.branch_name}
                  onChange={(e) =>
                    setSettings({ ...settings, branch_name: e.target.value })
                  }
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded px-2.5 py-2 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-mono text-[11px] text-slate-600 uppercase block font-semibold mb-1">
                  GSTIN Identity *
                </label>
                <input
                  type="text"
                  required
                  value={settings.gstin}
                  onChange={(e) =>
                    setSettings({ ...settings, gstin: e.target.value.toUpperCase() })
                  }
                  className="w-full font-mono text-xs bg-slate-50 border border-slate-200 rounded px-2.5 py-2 font-medium"
                />
              </div>

              <div>
                <label className="font-mono text-[11px] text-slate-600 uppercase block font-semibold mb-1">
                  Support Contact Phone
                </label>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) =>
                    setSettings({ ...settings, phone: e.target.value })
                  }
                  className="w-full font-mono text-xs bg-slate-50 border border-slate-200 rounded px-2.5 py-2 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="font-mono text-[11px] text-slate-600 uppercase block font-semibold mb-1">
                Storefront & Warehouse Address
              </label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) =>
                  setSettings({ ...settings, address: e.target.value })
                }
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded px-2.5 py-2 font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-mono text-[11px] text-slate-600 uppercase block font-semibold mb-1">
                  Invoice Header Title
                </label>
                <input
                  type="text"
                  value={settings.bill_header}
                  onChange={(e) =>
                    setSettings({ ...settings, bill_header: e.target.value })
                  }
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded px-2.5 py-2 font-medium"
                />
              </div>

              <div>
                <label className="font-mono text-[11px] text-slate-600 uppercase block font-semibold mb-1">
                  UPI VPA Identity
                </label>
                <input
                  type="text"
                  value={settings.upi_id}
                  onChange={(e) =>
                    setSettings({ ...settings, upi_id: e.target.value })
                  }
                  className="w-full font-mono text-xs bg-slate-50 border border-slate-200 rounded px-2.5 py-2 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="font-mono text-[11px] text-slate-600 uppercase block font-semibold mb-1">
                Terms & Conditions Note
              </label>
              <textarea
                rows={3}
                value={settings.terms_and_conditions}
                onChange={(e) =>
                  setSettings({ ...settings, terms_and_conditions: e.target.value })
                }
                className="w-full font-mono text-xs bg-slate-50 border border-slate-200 rounded px-2.5 py-2 font-medium"
              />
            </div>

            <div>
              <label className="font-mono text-[11px] text-slate-600 uppercase block font-semibold mb-1">
                Bill Footer Memo
              </label>
              <input
                type="text"
                value={settings.bill_footer}
                onChange={(e) =>
                  setSettings({ ...settings, bill_footer: e.target.value })
                }
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded px-2.5 py-2 font-medium"
              />
            </div>

            {/* Visual element toggles */}
            <div className="pt-2 border-t border-slate-100 flex items-center gap-6 flex-wrap">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={settings.show_logo}
                  onChange={(e) =>
                    setSettings({ ...settings, show_logo: e.target.checked })
                  }
                  className="rounded text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                />
                <span>Include Brand Logo</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={settings.show_barcode}
                  onChange={(e) =>
                    setSettings({ ...settings, show_barcode: e.target.checked })
                  }
                  className="rounded text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                />
                <span>Include Invoice Barcode</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={settings.show_qr}
                  onChange={(e) =>
                    setSettings({ ...settings, show_qr: e.target.checked })
                  }
                  className="rounded text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                />
                <span>Include Dynamic UPI QR</span>
              </label>
            </div>

            {/* Save Button */}
            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="h-10 px-6 bg-primary-container text-white hover:bg-primary font-semibold text-xs rounded-xl flex items-center gap-2 shadow-xs transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? "Saving..." : "Apply & Save Template"}</span>
              </button>
            </div>
          </form>

          {/* Right Live Preview (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <span className="font-mono text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
              Live Paper Bill Preview Studio
            </span>
            <LiveInvoicePreview settings={settings} />
          </div>
        </div>
      ) : (
        /* System Governance Tab */
        <div className="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm border border-slate-200/70 max-w-3xl flex flex-col gap-4">
          <div>
            <h3 className="font-headline-sm text-headline-sm font-semibold text-slate-900">
              System Governance & Access Control
            </h3>
            <p className="font-body-md text-body-md text-secondary mt-0.5">
              Multi-branch permissions, register sound feedback, and accounting audit locks.
            </p>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            <div className="py-3 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-800 block">
                  Audio Feedback on Barcode Scan
                </span>
                <span className="text-slate-500">
                  Emit cashier register sound beep upon barcode or hotkey trigger.
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.enable_sound}
                onChange={(e) =>
                  setSettings({ ...settings, enable_sound: e.target.checked })
                }
                className="rounded text-primary w-4 h-4"
              />
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-800 block">
                  Playful Microcopy Engine
                </span>
                <span className="text-slate-500">
                  Enable high-confidence accounting cues ("Let's Cook", "All squared away, Boss").
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.playful_mode}
                onChange={(e) =>
                  setSettings({ ...settings, playful_mode: e.target.checked })
                }
                className="rounded text-primary w-4 h-4"
              />
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-800 block">
                  Default IGST / CGST Tax Bracket
                </span>
                <span className="text-slate-500">
                  Applied by default to newly cataloged wholesale commodities.
                </span>
              </div>
              <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded">
                {settings.tax_rate_default}% GST
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="self-start mt-2 h-9 px-5 bg-primary-container text-white hover:bg-primary font-semibold text-xs rounded shadow-xs transition-colors"
          >
            Update Governance Flags
          </button>
        </div>
      )}
    </div>
  );
};
