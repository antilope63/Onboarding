"use client"

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react"

import NavBar from "@/components/NavBar"
import OrgD3Tree from "@/components/Organigramme/Organigramme-d3-tree"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import type { OrgNode } from "@/types/org"
import {
  createOrgNode as createNodeInDb,
  deleteOrgNode as deleteNodeInDb,
  fetchOrgTree,
  updateOrgNode as updateNodeInDb,
} from "@/lib/supabase/services/org"

function cloneNode(node: OrgNode): OrgNode {
  return {
    ...node,
    children: node.children?.map(cloneNode),
  }
}

function updateNodeById(
  node: OrgNode,
  id: string,
  updater: (node: OrgNode) => OrgNode
): OrgNode {
  if (node.id === id) {
    return updater(node)
  }
  if (!node.children) {
    return node
  }
  return {
    ...node,
    children: node.children.map((child) => updateNodeById(child, id, updater)),
  }
}

function addChildToNode(node: OrgNode, parentId: string, child: OrgNode): OrgNode {
  if (node.id === parentId) {
    const children = node.children ? [...node.children, child] : [child]
    return { ...node, children }
  }
  if (!node.children) {
    return node
  }
  return {
    ...node,
    children: node.children.map((existing) => addChildToNode(existing, parentId, child)),
  }
}

function removeNodeById(node: OrgNode, id: string): OrgNode {
  if (!node.children) {
    return node
  }
  const filtered = node.children
    .filter((child) => child.id !== id)
    .map((child) => removeNodeById(child, id))

  return {
    ...node,
    children: filtered.length ? filtered : undefined,
  }
}

function findNodeById(node: OrgNode, id: string): OrgNode | null {
  if (node.id === id) return node
  for (const child of node.children ?? []) {
    const found = findNodeById(child, id)
    if (found) return found
  }
  return null
}

function normalizeName(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z\s'-]/g, "")
}

function computeEmail(fullName: string): string {
  const ascii = normalizeName(fullName).trim()
  if (!ascii) return "contact@pixelplay.com"
  const parts = ascii.split(/\s+/).filter(Boolean)
  if (!parts.length) return "contact@pixelplay.com"
  const first = parts[0].toLowerCase().replace(/['-]/g, "")
  const last = parts[parts.length - 1]?.toLowerCase().replace(/['-]/g, "")
  return last ? `${first}.${last}@pixelplay.com` : `${first}@pixelplay.com`
}

function computeOfficeNumber(name: string, role?: string): string {
  const roleText = (role ?? "").toLowerCase()
  const executive =
    roleText.includes("ceo") ||
    roleText.includes("cto") ||
    roleText.includes("coo") ||
    roleText.includes("cfo") ||
    roleText.includes("vp")
  const base = executive ? 100 : 0
  const hash = Array.from(name).reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % 100
  const number = base + Math.max(1, hash)
  return String(number).padStart(3, "0")
}

export default function OrganigrammePage() {
  const [treeData, setTreeData] = useState<OrgNode | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    let active = true

    const load = async () => {
      setIsLoading(true)
      try {
        const fetched = await fetchOrgTree()
        if (!active) return
        setTreeData(fetched ? cloneNode(fetched) : null)
        setError(null)
      } catch (err) {
        if (!active) return
        console.error("Organigramme: unable to load tree", err)
        setError(err instanceof Error ? err.message : "Erreur inconnue")
      } finally {
        if (active) {
          setIsLoading(false)
        }
      }
    }

    void load()

    return () => {
      active = false
    }
  }, [])
  const { role } = useAuth()
  const canManage = role === "manager" || role === "rh"

  const [selectedNode, setSelectedNode] = useState<OrgNode | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [editForm, setEditForm] = useState({
    name: "",
    title: "",
    image: "",
    count: "",
  })
  const [childForm, setChildForm] = useState({
    name: "",
    title: "",
    image: "",
    count: "",
  })

  const email = useMemo(
    () => computeEmail(selectedNode?.name ?? ""),
    [selectedNode?.name]
  )
  const officeNumber = useMemo(
    () => computeOfficeNumber(selectedNode?.name ?? "", selectedNode?.title),
    [selectedNode?.name, selectedNode?.title]
  )

  const handleNodeSelect = useCallback((node: OrgNode) => {
    setSelectedNode(node)
    setEditForm({
      name: node.name,
      title: node.title,
      image: node.image ?? "",
      count: typeof node.count === "number" ? String(node.count) : "",
    })
    setChildForm({ name: "", title: "", image: "", count: "" })
    setIsDialogOpen(true)
  }, [])

  const handleSaveNode = useCallback(async () => {
    if (!selectedNode || !treeData) return

    const trimmedName = editForm.name.trim() || selectedNode.name
    const trimmedTitle = editForm.title.trim() || selectedNode.title
    const trimmedImage = editForm.image.trim()
    const trimmedCount = editForm.count.trim()
    const parsedCount = trimmedCount ? Number.parseInt(trimmedCount, 10) : undefined
    const safeCount =
      trimmedCount && !Number.isNaN(parsedCount) ? parsedCount : undefined

    try {
      await updateNodeInDb(selectedNode.id, {
        name: trimmedName,
        title: trimmedTitle,
        image: trimmedImage || undefined,
        count: safeCount,
      })

      setTreeData((previous) => {
        if (!previous) return previous
        const next = updateNodeById(previous, selectedNode.id, (node) => ({
          ...node,
          name: trimmedName,
          title: trimmedTitle,
          image: trimmedImage ? trimmedImage : undefined,
          count: safeCount,
        }))
        const refreshed = findNodeById(next, selectedNode.id)
        setSelectedNode(refreshed)
        return next
      })
    } catch (err) {
      console.error("Organigramme: unable to update node", err)
    }
  }, [editForm, selectedNode, treeData])

  const handleAddChild = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      if (!selectedNode || !treeData) return
      if (!childForm.name.trim() || !childForm.title.trim()) {
        return
      }

      const trimmedCount = childForm.count.trim()
      const parsedCount = trimmedCount ? Number.parseInt(trimmedCount, 10) : undefined
      const safeCount =
        trimmedCount && !Number.isNaN(parsedCount) ? parsedCount : undefined

      try {
        const created = await createNodeInDb({
          parentId: selectedNode.id,
          name: childForm.name.trim(),
          title: childForm.title.trim(),
          image: childForm.image.trim() || undefined,
          count: safeCount,
        })

        setTreeData((previous) => {
          if (!previous) return previous
          const next = addChildToNode(previous, selectedNode.id, created)
          const refreshed = findNodeById(next, selectedNode.id)
          setSelectedNode(refreshed)
          return next
        })

        setChildForm({ name: "", title: "", image: "", count: "" })
      } catch (err) {
        console.error("Organigramme: unable to create node", err)
      }
    },
    [childForm, selectedNode, treeData]
  )

  const handleDeleteNode = useCallback(async () => {
    if (!selectedNode || !treeData) return
    if (selectedNode.id === treeData.id) return
    if (!window.confirm(`Supprimer ${selectedNode.name} et son équipe ?`)) {
      return
    }

    try {
      await deleteNodeInDb(selectedNode.id)
      setTreeData((previous) =>
        previous ? removeNodeById(previous, selectedNode.id) : previous
      )
      setSelectedNode(null)
      setIsDialogOpen(false)
    } catch (err) {
      console.error("Organigramme: unable to delete node", err)
    }
  }, [selectedNode, treeData])

  if (isLoading) {
    return (
      <section className="relative flex min-h-screen w-full flex-col items-center justify-center bg-noir text-white">
        Chargement de l&apos;organigramme...
      </section>
    )
  }

  if (error) {
    return (
      <section className="relative flex min-h-screen w-full flex-col items-center justify-center bg-noir text-white">
        <p className="text-red-300">{error}</p>
      </section>
    )
  }

  if (!treeData) {
    return (
      <section className="relative flex min-h-screen w-full flex-col items-center justify-center bg-noir text-white">
        <p>Aucun organigramme disponible.</p>
      </section>
    )
  }

  return (
    <section className="relative flex min-h-screen w-full flex-col items-center gap-8 bg-noir">
      <NavBar classname="absolute top-0 left-0" />
      <OrgD3Tree data={treeData} onSelectNode={handleNodeSelect} />

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) {
            setSelectedNode(null)
          }
        }}
      >
        <DialogContent className="max-w-xl border-white/10 bg-bleu_fonce_2 text-white">
          <DialogHeader>
            <DialogTitle className="text-3xl font-semibold">
              {selectedNode?.name}
            </DialogTitle>
            <DialogDescription className="text-white/70">
              {selectedNode?.title}
            </DialogDescription>
          </DialogHeader>

          {selectedNode && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/70">
                <p>Email : {email}</p>
                <p>Bureau : {officeNumber}</p>
                {typeof selectedNode.count === "number" && (
                  <p>Équipe : {selectedNode.count} personnes</p>
                )}
                <p>Relations directes : {selectedNode.children?.length ?? 0}</p>
              </div>

              {canManage && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-white/60">
                      Modifier
                    </h3>
                    <div className="grid gap-3">
                      <div className="grid gap-1">
                        <label className="text-xs text-white/60">Nom</label>
                        <Input
                          value={editForm.name}
                          onChange={(event) =>
                            setEditForm((prev) => ({
                              ...prev,
                              name: event.target.value,
                            }))
                          }
                          className="border-white/20 bg-white/10 text-white"
                        />
                      </div>
                      <div className="grid gap-1">
                        <label className="text-xs text-white/60">Titre</label>
                        <Input
                          value={editForm.title}
                          onChange={(event) =>
                            setEditForm((prev) => ({
                              ...prev,
                              title: event.target.value,
                            }))
                          }
                          className="border-white/20 bg-white/10 text-white"
                        />
                      </div>
                      <div className="grid gap-1">
                        <label className="text-xs text-white/60">Photo</label>
                        <Input
                          value={editForm.image}
                          onChange={(event) =>
                            setEditForm((prev) => ({
                              ...prev,
                              image: event.target.value,
                            }))
                          }
                          placeholder="/Organigramme/..."
                          className="border-white/20 bg-white/10 text-white"
                        />
                      </div>
                      <div className="grid gap-1">
                        <label className="text-xs text-white/60">
                          Taille d&apos;équipe (optionnel)
                        </label>
                        <Input
                          value={editForm.count}
                          onChange={(event) =>
                            setEditForm((prev) => ({
                              ...prev,
                              count: event.target.value,
                            }))
                          }
                          placeholder="Ex: 12"
                          className="border-white/20 bg-white/10 text-white"
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      onClick={handleSaveNode}
                      className="rounded-full bg-violet_fonce_1 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet"
                    >
                      Enregistrer
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-white/60">
                      Ajouter un collaborateur
                    </h3>
                    <form className="grid gap-3" onSubmit={handleAddChild}>
                      <div className="grid gap-1">
                        <label className="text-xs text-white/60">Nom</label>
                        <Input
                          value={childForm.name}
                          onChange={(event) =>
                            setChildForm((prev) => ({
                              ...prev,
                              name: event.target.value,
                            }))
                          }
                          required
                          className="border-white/20 bg-white/10 text-white"
                        />
                      </div>
                      <div className="grid gap-1">
                        <label className="text-xs text-white/60">Titre</label>
                        <Input
                          value={childForm.title}
                          onChange={(event) =>
                            setChildForm((prev) => ({
                              ...prev,
                              title: event.target.value,
                            }))
                          }
                          required
                          className="border-white/20 bg-white/10 text-white"
                        />
                      </div>
                      <div className="grid gap-1">
                        <label className="text-xs text-white/60">Photo</label>
                        <Input
                          value={childForm.image}
                          onChange={(event) =>
                            setChildForm((prev) => ({
                              ...prev,
                              image: event.target.value,
                            }))
                          }
                          placeholder="/Organigramme/..."
                          className="border-white/20 bg-white/10 text-white"
                        />
                      </div>
                      <div className="grid gap-1">
                        <label className="text-xs text-white/60">
                          Taille d&apos;équipe
                        </label>
                        <Input
                          value={childForm.count}
                          onChange={(event) =>
                            setChildForm((prev) => ({
                              ...prev,
                              count: event.target.value,
                            }))
                          }
                          placeholder="Ex: 6"
                          className="border-white/20 bg-white/10 text-white"
                        />
                      </div>
                      <Button
                        type="submit"
                        className="rounded-full bg-violet_fonce_1 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet"
                      >
                        Ajouter
                      </Button>
                    </form>
                  </div>

                  {selectedNode.id !== treeData.id && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleDeleteNode}
                      className="border-red-400/60 text-red-200 hover:bg-red-500/20"
                    >
                      Supprimer ce nœud
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false)
                setSelectedNode(null)
              }}
              className="border-white/30 text-white hover:bg-white/10"
            >
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}
