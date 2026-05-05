import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { toast } from 'sonner'

interface Role { RoleId: string; RoleName: string; RoleNote: string }

const empty = { RoleName: '', RoleNote: '' }

export default function XpRolePage() {
  const [rows, setRows] = useState<Role[]>([])
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ ...empty })

  const load = async () => {
    const res = await api.get('/xprole')
    setRows(res.data.data)
  }

  useEffect(() => { load() }, [])

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const openAdd = () => { setEditId(null); setForm({ ...empty }); setOpen(true) }
  const openEdit = (r: Role) => { setEditId(r.RoleId); setForm({ RoleName: r.RoleName, RoleNote: r.RoleNote }); setOpen(true) }

  const save = async () => {
    try {
      if (editId) {
        await api.put(`/xprole/${editId}`, { RoleId: editId, ...form })
        toast.success('更新成功')
      } else {
        await api.post('/xprole', form)
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
    await api.delete(`/xprole/${id}`)
    toast.success('刪除成功')
    load()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">角色設定</h1>
        <Button onClick={openAdd}>新增</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>角色代碼</TableHead>
            <TableHead>角色名稱</TableHead>
            <TableHead>備註</TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(r => (
            <TableRow key={r.RoleId}>
              <TableCell>{r.RoleId}</TableCell>
              <TableCell>{r.RoleName}</TableCell>
              <TableCell>{r.RoleNote}</TableCell>
              <TableCell className="space-x-2">
                <Button size="sm" variant="outline" onClick={() => openEdit(r)}>編輯</Button>
                <Button size="sm" variant="destructive" onClick={() => remove(r.RoleId)}>刪除</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editId ? '編輯角色' : '新增角色'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <Label>角色名稱</Label>
              <Input value={form.RoleName} onChange={e => set('RoleName', e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>備註</Label>
              <Input value={form.RoleNote} onChange={e => set('RoleNote', e.target.value)} />
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
