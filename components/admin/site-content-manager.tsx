"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { ArrowDown, ArrowUp, Link2, Pencil, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { SitePage, SitePageSection, SupportChannel } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type PageForm = {
  id: string;
  slug: string;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  body: string;
  sections: SitePageSection[];
};

type SupportChannelForm = {
  id?: string;
  title: string;
  description: string;
  href: string;
  buttonLabel: string;
  order: string;
  active: boolean;
};

const blankChannel: SupportChannelForm = {
  title: "",
  description: "",
  href: "",
  buttonLabel: "Open channel",
  order: "0",
  active: true
};

function buildPageForm(page: SitePage | undefined): PageForm {
  return {
    id: page?.id || "",
    slug: page?.slug || "",
    label: page?.label || "",
    eyebrow: page?.eyebrow || "",
    title: page?.title || "",
    description: page?.description || "",
    body: page?.body || "",
    sections: page?.sections?.map((section) => ({ ...section })) || []
  };
}

function makeSection(): SitePageSection {
  const seed = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  return {
    id: `section-${seed}`,
    title: "",
    description: "",
    href: "",
    ctaLabel: ""
  };
}

export function SiteContentManager({
  pages,
  supportChannels
}: {
  pages: SitePage[];
  supportChannels: SupportChannel[];
}) {
  const [selectedPageId, setSelectedPageId] = useState(pages[0]?.id || "");
  const selectedPage = useMemo(
    () => pages.find((page) => page.id === selectedPageId) || pages[0],
    [pages, selectedPageId]
  );
  const [pageForm, setPageForm] = useState<PageForm>(() => buildPageForm(pages[0]));
  const [savingPage, setSavingPage] = useState(false);
  const [channelForm, setChannelForm] = useState<SupportChannelForm>(blankChannel);
  const [savingChannel, setSavingChannel] = useState(false);
  const [reorderingChannelId, setReorderingChannelId] = useState<string | null>(null);

  useEffect(() => {
    setPageForm(buildPageForm(selectedPage));
  }, [selectedPage]);

  async function savePage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingPage(true);

    try {
      const payload = {
        id: pageForm.id,
        slug: pageForm.slug,
        label: pageForm.label.trim(),
        eyebrow: pageForm.eyebrow.trim(),
        title: pageForm.title.trim(),
        description: pageForm.description.trim(),
        body: pageForm.body.trim(),
        sections: pageForm.sections
          .map((section) => ({
            id: section.id,
            title: section.title.trim(),
            description: section.description.trim(),
            href: section.href?.trim() || "",
            ctaLabel: section.ctaLabel?.trim() || ""
          }))
          .filter((section) => section.title || section.description || section.href)
      };

      if (!payload.id) {
        throw new Error("Choose a page to edit first.");
      }

      const response = await fetch("/api/admin/site-pages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Unable to save page.");
      }

      toast.success(`${payload.label} updated.`);
      window.location.reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save page.");
    } finally {
      setSavingPage(false);
    }
  }

  function updateSection(index: number, key: keyof SitePageSection, value: string) {
    setPageForm((current) => ({
      ...current,
      sections: current.sections.map((section, sectionIndex) =>
        sectionIndex === index ? { ...section, [key]: value } : section
      )
    }));
  }

  function removeSection(index: number) {
    setPageForm((current) => ({
      ...current,
      sections: current.sections.filter((_, sectionIndex) => sectionIndex !== index)
    }));
  }

  function resetChannelForm() {
    setChannelForm(blankChannel);
  }

  async function saveSupportChannel(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingChannel(true);

    try {
      const payload = {
        id: channelForm.id,
        title: channelForm.title.trim(),
        description: channelForm.description.trim(),
        href: channelForm.href.trim(),
        buttonLabel: channelForm.buttonLabel.trim(),
        order: Number(channelForm.order || "0"),
        active: channelForm.active
      };

      if (!payload.title || !payload.description || !payload.href || !payload.buttonLabel) {
        throw new Error("Title, description, link, and button label are required.");
      }

      const response = await fetch("/api/admin/support-channels", {
        method: channelForm.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Unable to save support channel.");
      }

      toast.success(channelForm.id ? "Support channel updated." : "Support channel created.");
      resetChannelForm();
      window.location.reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save support channel.");
    } finally {
      setSavingChannel(false);
    }
  }

  async function deleteSupportChannel(id: string) {
    if (!confirm("Delete this support channel?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/support-channels?id=${id}`, {
        method: "DELETE"
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Unable to delete support channel.");
      }

      toast.success("Support channel deleted.");
      window.location.reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete support channel.");
    }
  }

  async function moveSupportChannel(channelId: string, direction: -1 | 1) {
    const index = supportChannels.findIndex((channel) => channel.id === channelId);
    const targetIndex = index + direction;

    if (index === -1 || targetIndex < 0 || targetIndex >= supportChannels.length) {
      return;
    }

    const reordered = [...supportChannels];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    try {
      setReorderingChannelId(channelId);
      const response = await fetch("/api/admin/support-channels", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          updates: reordered.map((channel, orderedIndex) => ({ id: channel.id, order: orderedIndex }))
        })
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Unable to reorder support channels.");
      }

      toast.success("Support channel order updated.");
      window.location.reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to reorder support channels.");
    } finally {
      setReorderingChannelId(null);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <Card className="h-full">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">Editable pages</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Update the footer pages, legal pages, and store help text from admin.
            </p>
          </div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{pages.length} pages</p>
        </div>

        <div className="mt-5 grid gap-6 xl:grid-cols-[0.4fr_0.6fr]">
          <div className="space-y-2 rounded-[1.5rem] border border-border/70 bg-muted/15 p-3">
            {pages.map((page) => {
              const active = page.id === selectedPage?.id;
              return (
                <button
                  key={page.id}
                  type="button"
                  onClick={() => setSelectedPageId(page.id)}
                  className={`w-full rounded-[1.25rem] border px-4 py-3 text-left transition ${
                    active
                      ? "border-primary/30 bg-primary/10 text-foreground"
                      : "border-border/60 bg-background/70 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <p className="text-sm font-semibold">{page.label}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] opacity-70">/{page.slug}</p>
                </button>
              );
            })}
          </div>

          <form onSubmit={savePage} className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm text-muted-foreground">
                <span>Footer label</span>
                <Input
                  value={pageForm.label}
                  onChange={(event) => setPageForm((current) => ({ ...current, label: event.target.value }))}
                  placeholder="About"
                  required
                />
              </label>
              <label className="grid gap-2 text-sm text-muted-foreground">
                <span>Eyebrow</span>
                <Input
                  value={pageForm.eyebrow}
                  onChange={(event) => setPageForm((current) => ({ ...current, eyebrow: event.target.value }))}
                  placeholder="About"
                  required
                />
              </label>
            </div>

            <label className="grid gap-2 text-sm text-muted-foreground">
              <span>Page title</span>
              <Input
                value={pageForm.title}
                onChange={(event) => setPageForm((current) => ({ ...current, title: event.target.value }))}
                placeholder="Page title"
                required
              />
            </label>

            <label className="grid gap-2 text-sm text-muted-foreground">
              <span>Short description</span>
              <textarea
                value={pageForm.description}
                onChange={(event) => setPageForm((current) => ({ ...current, description: event.target.value }))}
                placeholder="Page intro"
                className="field min-h-24 resize-y"
                required
              />
            </label>

            <label className="grid gap-2 text-sm text-muted-foreground">
              <span>Body content</span>
              <textarea
                value={pageForm.body}
                onChange={(event) => setPageForm((current) => ({ ...current, body: event.target.value }))}
                placeholder="Use blank lines to separate paragraphs."
                className="field min-h-40 resize-y"
              />
            </label>

            <div className="space-y-3 rounded-[1.5rem] border border-border/70 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">Page items</p>
                  <p className="text-xs text-muted-foreground">
                    Use these as cards, rules, or FAQ rows depending on the page.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  className="h-10 px-4 text-xs"
                  onClick={() => setPageForm((current) => ({ ...current, sections: [...current.sections, makeSection()] }))}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add item
                </Button>
              </div>

              <div className="space-y-3">
                {pageForm.sections.map((section, index) => (
                  <div key={section.id} className="rounded-[1.25rem] border border-border/70 bg-background/70 p-4">
                    <div className="grid gap-3 md:grid-cols-2">
                      <Input
                        value={section.title}
                        onChange={(event) => updateSection(index, "title", event.target.value)}
                        placeholder="Item title"
                      />
                      <Input
                        value={section.ctaLabel || ""}
                        onChange={(event) => updateSection(index, "ctaLabel", event.target.value)}
                        placeholder="Button label (optional)"
                      />
                    </div>
                    <textarea
                      value={section.description}
                      onChange={(event) => updateSection(index, "description", event.target.value)}
                      placeholder="Item text"
                      className="field mt-3 min-h-24 resize-y"
                    />
                    <div className="mt-3 flex items-center gap-3">
                      <div className="relative flex-1">
                        <Link2 className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          value={section.href || ""}
                          onChange={(event) => updateSection(index, "href", event.target.value)}
                          placeholder="Optional link"
                          className="pl-10"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSection(index)}
                        className="rounded-full border border-rose-500/25 p-2 text-rose-600"
                        aria-label="Remove page item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {pageForm.sections.length === 0 ? (
                  <p className="rounded-[1.25rem] border border-dashed border-border/70 px-4 py-6 text-center text-sm text-muted-foreground">
                    No items added yet for this page.
                  </p>
                ) : null}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={savingPage}>
                <Save className="mr-2 h-4 w-4" />
                {savingPage ? "Saving..." : "Save page"}
              </Button>
              <Button type="button" variant="ghost" onClick={() => setPageForm(buildPageForm(selectedPage))}>
                Reset changes
              </Button>
            </div>
          </form>
        </div>
      </Card>

      <Card className="h-full">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">Support channels</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Add one or many support links. Customers can choose the right channel on the public pages.
            </p>
          </div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {supportChannels.length} links
          </p>
        </div>

        <div className="mt-5 grid gap-5">
          <form onSubmit={saveSupportChannel} className="grid gap-4 rounded-[1.5rem] border border-border/70 p-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                value={channelForm.title}
                onChange={(event) => setChannelForm((current) => ({ ...current, title: event.target.value }))}
                placeholder="WhatsApp"
                required
              />
              <Input
                value={channelForm.buttonLabel}
                onChange={(event) => setChannelForm((current) => ({ ...current, buttonLabel: event.target.value }))}
                placeholder="Open WhatsApp"
                required
              />
            </div>

            <textarea
              value={channelForm.description}
              onChange={(event) => setChannelForm((current) => ({ ...current, description: event.target.value }))}
              placeholder="Short help text for this support option"
              className="field min-h-24 resize-y"
              required
            />

            <div className="grid gap-4 md:grid-cols-[1fr_140px]">
              <Input
                value={channelForm.href}
                onChange={(event) => setChannelForm((current) => ({ ...current, href: event.target.value }))}
                placeholder="https://wa.me/..."
                required
              />
              <Input
                type="number"
                min="0"
                value={channelForm.order}
                onChange={(event) => setChannelForm((current) => ({ ...current, order: event.target.value }))}
                placeholder="Order"
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={channelForm.active}
                onChange={(event) => setChannelForm((current) => ({ ...current, active: event.target.checked }))}
                className="h-4 w-4"
              />
              Active support channel
            </label>

            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={savingChannel}>
                {savingChannel ? "Saving..." : channelForm.id ? "Update channel" : "Add channel"}
              </Button>
              {channelForm.id ? (
                <Button type="button" variant="ghost" onClick={resetChannelForm}>
                  Cancel edit
                </Button>
              ) : null}
            </div>
          </form>

          <div className="space-y-3 rounded-[1.5rem] border border-border/70 p-3">
            {supportChannels.map((channel, index) => (
              <div key={channel.id} className="rounded-[1.25rem] border border-border/70 bg-background/70 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{channel.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{channel.description}</p>
                    <p className="mt-2 text-xs text-muted-foreground">{channel.href}</p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase ${
                      channel.active
                        ? "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300"
                        : "bg-slate-500/12 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {channel.active ? "active" : "hidden"}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setChannelForm({
                        id: channel.id,
                        title: channel.title,
                        description: channel.description,
                        href: channel.href,
                        buttonLabel: channel.buttonLabel,
                        order: String(channel.order ?? index),
                        active: channel.active
                      })
                    }
                    className="rounded-full border border-border/70 p-2 text-muted-foreground hover:text-foreground"
                    aria-label={`Edit ${channel.title}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveSupportChannel(channel.id, -1)}
                    disabled={index === 0 || reorderingChannelId === channel.id}
                    className="rounded-full border border-border/70 p-2 text-muted-foreground disabled:opacity-40"
                    aria-label={`Move ${channel.title} up`}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveSupportChannel(channel.id, 1)}
                    disabled={index === supportChannels.length - 1 || reorderingChannelId === channel.id}
                    className="rounded-full border border-border/70 p-2 text-muted-foreground disabled:opacity-40"
                    aria-label={`Move ${channel.title} down`}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteSupportChannel(channel.id)}
                    className="rounded-full border border-rose-500/25 p-2 text-rose-600"
                    aria-label={`Delete ${channel.title}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

            {supportChannels.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                No support channels added yet.
              </p>
            ) : null}
          </div>
        </div>
      </Card>
    </div>
  );
}
