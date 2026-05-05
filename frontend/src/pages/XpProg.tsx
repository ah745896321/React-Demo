import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { toast } from 'sonner'

interface Prog { ProgId: string; ProgName: string; ProgNote: string; ProgUrl: string; ProgIcon: string }

const empty = { ProgId: '', ProgName: '', ProgNote: '', ProgUrl: '', ProgIcon: '' }

export default function XpProgPage() {
  const [rows, setRows] = useState<Prog[]>([])
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ ...empty })

  const load = async () => {
    const res = await api.get('/xpprog')
    setRows(res.data.data)
  }

  useEffect(() => { load() }, [])

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const openAdd = () => { setEditId(null); setForm({ ...empty }); setOpen(true) }
  const openEdit = (p: Prog) => { setEditId(p.ProgId); setForm({ ...p }); setOpen(true) }

  const save = async () => {
    try {
      if (editId) {
        await api.put(`/xpprog/${editId}`, form)
        toast.success('更新成功')
      } else {
        await api.post('/xpprog', form)
        toast.success('新增成功')
      }
      setOpen(false)
      load()
    } catch {
      toast.error('操作失敗')
    }
  }

  const remove = async (id: string) => {
    if (!confirm('確定刪除？')) return
    await api.delete(`/xpprog/${id}`)
    toast.success('刪除成功')
    load()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">頁面維護</h1>
        <Button onClick={openAdd}>新增</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>頁面代碼</TableHead>
            <TableHead>頁面名稱</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>備註</TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(p => (
            <TableRow key={p.ProgId}>
              <TableCell>{p.ProgId}</TableCell>
              <TableCell>{p.ProgName}</TableCell>
              <TableCell>{p.ProgUrl}</TableCell>
              <TableCell>{p.ProgNote}</TableCell>
              <TableCell className="space-x-2">
                <Button size="sm" variant="outline" onClick={() => openEdit(p)}>編輯</Button>
                <Button size="sm" variant="destructive" onClick={() => remove(p.ProgId)}>刪除</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editId ? '編輯頁面' : '新增頁面'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 py-2">
            {!editId && (
              <div className="space-y-1">
                <Label>頁面代碼</Label>
                <Input value={form.ProgId} onChange={e => set('ProgId', e.target.value)} />
              </div>
            )}
            <div className="space-y-1">
              <Label>頁面名稱</Label>
              <Input value={form.ProgName} onChange={e => set('ProgName', e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>URL</Label>
              <Input value={form.ProgUrl} onChange={e => set('ProgUrl', e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>圖示</Label>
              <Input value={form.ProgIcon} onChange={e => set('ProgIcon', e.target.value)} />
            </div>
            <div className="space-y-1 col-span-2">
              <Label>備註</Label>
              <Input value={form.ProgNote} onChange={e => set('ProgNote', e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>取消</Button>
            <Button onClick={save}>儲存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
