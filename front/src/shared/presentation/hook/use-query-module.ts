

import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";

import type { PaginatedResponse } from "@/shared/domain/base/base-entity.types";
import type { CursorPaginationParams } from "@/shared/domain/base/base-repository.interface";
import type { FilterDto } from "@/shared/aplication/dtos/filter.dto";
import { useToast } from "./use-toast";
import { useAuthStore } from "../store/auth.store";
import type { LoginUser } from "@/modules/auth/domain/entity/auth.entity";

interface CursorPaginationState {
  limit: number;
  startCursor?: string | null;
  endCursor?: string | null;
}

interface PaginatedActions<T> {
  findAllPaginated: (params: CursorPaginationParams) => Promise<PaginatedResponse<T>>;
  findById: (id: string) => Promise<T>;
  create: (data: Partial<T>) => Promise<T>;
  update: (id: string, data: Partial<T>) => Promise<T>;
  remove: (id: string) => Promise<void>;
  login?: (data: Partial<T>) => Promise<T>;
}

export function useQueryModule<T>(queryKey: string, actions: PaginatedActions<T>, params?: { id?: string; disableQuery?: boolean }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [pagination, setPagination] = useState<CursorPaginationState>({
    limit: 10,
    startCursor: null,
    endCursor: null,
  });
  const [activeFilters, setActiveFilters] = useState<FilterDto[]>([]);

  const applyFilters = (filters: FilterDto[]) => {
    setActiveFilters(filters);
    setPagination({ limit: pagination.limit, startCursor: null, endCursor: null });
  };

  const resetFilters = () => applyFilters([]);

  const handleError = (error: unknown) => {
    const message = error instanceof Error ? error.message : "Error desconocido";
    toast.error(message);
  };

  const isDetailView = params?.id !== undefined;
  const isNewRecord = params?.id === 'new';
  const disableQuery = params?.disableQuery ?? false;

  const listQuery = useQuery<PaginatedResponse<T>>({
    queryKey: [queryKey, pagination, activeFilters],
    queryFn: () =>
      actions.findAllPaginated({
        limit: pagination.limit,
        afterCursor: pagination.startCursor,
        beforeCursor: pagination.endCursor,
        filters: activeFilters.length > 0 ? activeFilters : undefined,
      }),
    placeholderData: keepPreviousData,
    enabled: !isDetailView && !disableQuery,
  });

  const detailQuery = useQuery<T>({
    queryKey: [queryKey, params?.id],
    queryFn: () => actions.findById(params!.id!),
    placeholderData: keepPreviousData,
    enabled: isDetailView && !isNewRecord && !disableQuery,
  });

  const data: T | PaginatedResponse<T> | undefined = isDetailView
    ? (isNewRecord ? ({} as T) : detailQuery.data)
    : listQuery.data;

  const listData = isDetailView ? undefined : listQuery.data;
  const detailData = isDetailView ? (isNewRecord ? ({} as T) : detailQuery.data) : undefined;

  const isLoading = listQuery.isLoading || detailQuery.isLoading;


  const createMutation = useMutation({
    mutationFn: (newData: Partial<T>) => actions.create(newData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast.success("Registro creado correctamente.");
    },
    onError: handleError,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data: updateData }: { id: string; data: Partial<T> }) =>
      actions.update(id, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast.success("Registro actualizado correctamente.");
    },
    onError: handleError,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => actions.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast.success("Registro eliminado correctamente.");
    },
    onError: handleError,
  });

  const loginMutation = useMutation({
    mutationFn: (data: Partial<T>) => actions.login ? actions.login(data) : Promise.reject(new Error("Login no soportado")),
    onSuccess: (data) => {
      const { user, token } = data as unknown as { user: LoginUser; token: string };
      useAuthStore.getState().setLogin(user, token);
      toast.success("Login exitoso.");
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Error desconocido";
      toast.error(`Login fallido: ${message}`);
    },
  });

  return {
    data,
    listData,
    detailData,
    isLoading,
    pagination,
    setPagination,
    activeFilters,
    applyFilters,
    resetFilters,
    createMutation,
    updateMutation,
    deleteMutation,
    loginMutation
  };
}
