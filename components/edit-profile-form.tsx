'use client'

import { useState } from 'react'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { User } from '@supabase/supabase-js'

interface EditProfileFormProps {
  user: User
  profile: any
}

export function EditProfileForm({ user, profile }: EditProfileFormProps) {
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [fullName, setFullName] = useState(profile?.full_name || user.user_metadata?.full_name || '')
  const [phone, setPhone] = useState(profile?.phone || '')

  const handleSave = async () => {
    setLoading(true)
    setSuccess(false)

    try {
      const supabase = getSupabaseBrowserClient()
      
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          phone,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (error) throw error

      setSuccess(true)
      setEditing(false)
      
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!editing) {
    return (
      <div className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Nome</p>
          <p className="font-medium">{fullName || 'Não informado'}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">E-mail</p>
          <p className="font-medium">{user.email}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Telefone</p>
          <p className="font-medium">{phone || 'Não informado'}</p>
        </div>
        {success && (
          <div className="rounded-lg bg-green-50 p-3 text-sm text-green-800">
            Perfil atualizado com sucesso!
          </div>
        )}
        <Button onClick={() => setEditing(true)}>Editar Informações</Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Nome completo</Label>
        <Input
          id="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          disabled={loading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          value={user.email}
          disabled
          className="bg-muted"
        />
        <p className="text-xs text-muted-foreground">O e-mail não pode ser alterado</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Telefone</Label>
        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={loading}
        />
      </div>
      <div className="flex gap-2">
        <Button onClick={handleSave} disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar'}
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setEditing(false)
            setFullName(profile?.full_name || user.user_metadata?.full_name || '')
            setPhone(profile?.phone || '')
          }}
          disabled={loading}
        >
          Cancelar
        </Button>
      </div>
    </div>
  )
}
