type ClassValue = string | number | boolean | undefined | null | ClassValue[]

function cn(...inputs: ClassValue[]): string {
  return inputs.flat(Number.POSITIVE_INFINITY).filter(Boolean).join(" ")
}

type ConfigSchema = Record<string, Record<string, ClassValue>>
type ConfigVariants<T extends ConfigSchema> = {
  [Variant in keyof T]?: keyof T[Variant]
}
type Props<T extends ConfigSchema> = ConfigVariants<T> & { class?: ClassValue; className?: ClassValue }

export type VariantProps<T extends (...args: any) => any> = Omit<Parameters<T>[0], "class" | "className">

export function cva<T extends ConfigSchema>(
  base: ClassValue,
  config?: {
    variants?: T
    defaultVariants?: ConfigVariants<T>
    compoundVariants?: Array<ConfigVariants<T> & { class?: ClassValue; className?: ClassValue }>
  },
) {
  return (props?: Props<T>) => {
    if (!config?.variants) {
      return cn(base, props?.class, props?.className)
    }

    const { variants, defaultVariants, compoundVariants } = config
    const classes: ClassValue[] = [base]

    // Apply variant classes
    Object.keys(variants).forEach((variantKey) => {
      const variantValue = props?.[variantKey as keyof typeof props] ?? defaultVariants?.[variantKey]
      if (variantValue) {
        classes.push(variants[variantKey][variantValue as string])
      }
    })

    // Apply compound variants
    if (compoundVariants && props) {
      compoundVariants.forEach((compound) => {
        const matches = Object.keys(compound).every((key) => {
          if (key === "class" || key === "className") return true
          return props[key as keyof typeof props] === compound[key as keyof typeof compound]
        })
        if (matches) {
          classes.push(compound.class, compound.className)
        }
      })
    }

    classes.push(props?.class, props?.className)
    return cn(...classes)
  }
}
