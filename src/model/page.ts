export type paging = {
  total_page: number
  current_page: number
  size: number
}

export type Pageable<T> = {
  data: Array<T>
  paging: paging
}
