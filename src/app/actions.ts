'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { OrderStatus, ProductType } from '@/types/order';

export async function createOrder(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Não autorizado' };
  }

  const client_name = formData.get('client_name') as string;
  const client_phone = formData.get('client_phone') as string;
  const product_type = formData.get('product_type') as ProductType;
  const description = formData.get('description') as string;
  const value = parseFloat(formData.get('value') as string);
  const delivery_date = formData.get('delivery_date') as string;
  const status = (formData.get('status') as OrderStatus) || 'pendente';

  if (!client_name || !product_type || !description || !value || !delivery_date) {
    return { error: 'Preencha todos os campos obrigatórios' };
  }

  const { error } = await supabase.from('orders').insert({
    user_id: user.id,
    client_name,
    client_phone: client_phone || null,
    product_type,
    description,
    value,
    delivery_date,
    status,
  });

  if (error) {
    return { error: 'Erro ao criar pedido: ' + error.message };
  }

  revalidatePath('/');
  return { success: true };
}

export async function updateOrder(id: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Não autorizado' };
  }

  const client_name = formData.get('client_name') as string;
  const client_phone = formData.get('client_phone') as string;
  const product_type = formData.get('product_type') as ProductType;
  const description = formData.get('description') as string;
  const value = parseFloat(formData.get('value') as string);
  const delivery_date = formData.get('delivery_date') as string;
  const status = formData.get('status') as OrderStatus;

  if (!client_name || !product_type || !description || !value || !delivery_date) {
    return { error: 'Preencha todos os campos obrigatórios' };
  }

  const { error } = await supabase
    .from('orders')
    .update({
      client_name,
      client_phone: client_phone || null,
      product_type,
      description,
      value,
      delivery_date,
      status,
    })
    .eq('id', id);

  if (error) {
    return { error: 'Erro ao atualizar pedido: ' + error.message };
  }

  revalidatePath('/');
  return { success: true };
}

export async function deleteOrder(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Não autorizado' };
  }

  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', id);

  if (error) {
    return { error: 'Erro ao excluir pedido: ' + error.message };
  }

  revalidatePath('/');
  return { success: true };
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Não autorizado' };
  }

  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id);

  if (error) {
    return { error: 'Erro ao atualizar status: ' + error.message };
  }

  revalidatePath('/');
  return { success: true };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/login');
}

export async function updateStoreName(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Não autorizado' };
  }

  const storeName = formData.get('store_name') as string;
  
  if (!storeName || storeName.trim() === '') {
    return { error: 'O nome da loja não pode ser vazio' };
  }

  const { error } = await supabase.auth.updateUser({
    data: { store_name: storeName }
  });

  if (error) {
    return { error: 'Erro ao atualizar nome: ' + error.message };
  }

  revalidatePath('/', 'layout');
  return { success: true };
}
