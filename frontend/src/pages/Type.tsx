import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { toast } from 'sonner'

interface XpType { TypeId: string; TypeName: string; TypeNote: string }

const empty = { TypeId: '', TypeName: '', TypeNote: '' }

export default function TypePage() {
  const [rows, setRows] = useState<XpType[]>([])
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ ...empty })

  const load = async () => {
    const res = await api.get('/type')
    setRows(res.data.data)
  }

  useEffect(() => { load() }, [])

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const openAdd = () => { setEditId(null); setForm({ ...empty }); setOpen(true) }
  const openEdit = (t: XpType) => { setEditId(t.TypeId); setForm({ ...t }); setOpen(true) }

  const save = async () => {
    try {
      if (editId) {
        await api.put(`/type/${editId}`, form)
        toast.success('更新成功')
      } else {
        await api.post('/type', form)
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
    await api.delete(`/type/${id}`)
    toast.success('刪除成功')
    load()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">代碼維護</h1>
        <Button onClick={openAdd}>新增</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>代碼</TableHead>
            <TableHead>名稱</TableHead>
            <TableHead>備註</TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(t => (
            <TableRow key={t.TypeId}>
              <TableCell>{t.TypeId}</TableCell>
              <TableCell>{t.TypeName}</TableCell>
              <TableCell>{t.TypeNote}</TableCell>
              <TableCell className="space-x-2">
                <Button size="sm" variant="outline" onClick={() => openEdit(t)}>編輯</Button>
                <Button size="sm" variant="destructive" onClick={() => remove(t.TypeId)}>刪除</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editId ? '編輯代碼' : '新增代碼'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            {!editId && (
              <div className="space-y-1">
                <Label>代碼</Label>
                <Input value={form.TypeId} onChange={e => set('TypeId', e.target.value)} />
              </div>
            )}
            <div className="space-y-1">
              <Label>名稱</Label>
              <Input value={form.TypeName} onChange={e => set('TypeName', e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>備註</Label>
              <Input value={form.TypeNote} onChange={e => set('TypeNote', e.target.value)} />
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
