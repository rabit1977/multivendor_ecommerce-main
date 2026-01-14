'use client';

// React
import { FC, useCallback, useEffect } from 'react';

// Prisma model
import { Category } from '@prisma/client';

// Form handling utilities
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// Schema
import { CategoryFormSchema } from '@/lib/schemas';

// UI Components

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import ImageUpload from '../shared/image-upload';

// Queries
import { upsertCategory } from '@/queries/category';

// Utils
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { v4 } from 'uuid';

interface CategoryDetailsProps {
  data?: Category;
}

const CategoryDetails: FC<CategoryDetailsProps> = ({ data }) => {
  // Initializing necessary hooks
  const { toast } = useToast(); // Hook for displaying toast messages
  const router = useRouter(); // Hook for routing

  // Form hook for managing form state and validation
  const form = useForm<z.infer<typeof CategoryFormSchema>>({
    mode: 'onChange', // Form validation mode
    resolver: zodResolver(CategoryFormSchema), // Resolver for form validation
    defaultValues: {
      // Setting default form values from data (if available)
      name: data?.name || '',
      image: data?.image ? [{ url: data.image }] : [{ url: '' }],
      url: data?.url || '',
      featured: data?.featured || false,
    },
  });

  // Loading status based on form submission
  const isLoading = form.formState.isSubmitting;

  // Memoized onChange callback for image field
  const handleImageChange = useCallback(
    (url: string) => {
      form.setValue('image', [{ url }], { shouldValidate: true });
    },
    [form]
  );

  // Memoized onRemove callback for image field
  const handleImageRemove = useCallback(
    (url: string) => {
      form.setValue(
        'image',
        form.getValues('image').filter((current) => current.url !== url),
        { shouldValidate: true }
      );
    },
    [form]
  );

  // Reset form values when data changes
  useEffect(() => {
    if (data) {
      form.reset({
        name: data?.name,
        image: [{ url: data?.image }],
        url: data?.url,
        featured: data?.featured,
      });
    }
  }, [data]);

  // Submit handler for form submission
  const handleSubmit = async (values: z.infer<typeof CategoryFormSchema>) => {
    try {
      // Upserting category data
      const response = await upsertCategory({
        id: data?.id ? data.id : v4(),
        name: values.name,
        image: values.image[0].url,
        url: values.url,
        featured: values.featured,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Displaying success message
      toast({
        title: data?.id
          ? 'Category has been updated.'
          : `Congratulations! '${response?.name}' is now created.`,
      });

      // Redirect or Refresh data
      if (data?.id) {
        router.refresh();
      } else {
        router.push('/dashboard/admin/categories');
      }
    } catch (error: any) {
      // Handling form submission errors
      console.log(error);
      toast({
        variant: 'destructive',
        title: 'Oops!',
        description: error.toString(),
      });
    }
  };

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Category Information</CardTitle>
        <CardDescription>
          {data?.id
            ? `Update ${data?.name} category information.`
            : ' Lets create a category. You can edit category later from the categories table or the category page.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-4'
          >
            <FormField
              control={form.control}
              name='image'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ImageUpload
                      type='profile'
                      value={field.value.map((image) => image.url)}
                      disabled={isLoading}
                      onChange={handleImageChange}
                      onRemove={handleImageRemove}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={isLoading}
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem className='flex-1'>
                  <FormLabel>Category name</FormLabel>
                  <FormControl>
                    <Input placeholder='Name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={isLoading}
              control={form.control}
              name='url'
              render={({ field }) => (
                <FormItem className='flex-1'>
                  <FormLabel>Category url</FormLabel>
                  <FormControl>
                    <Input placeholder='/category-url' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='featured'
              render={({ field }) => (
                <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      // @ts-ignore
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className='space-y-1 leading-none'>
                    <FormLabel>Featured</FormLabel>
                    <FormDescription>
                      This Category will appear on the home page
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <Button type='submit' disabled={isLoading}>
              {isLoading
                ? 'loading...'
                : data?.id
                ? 'Save category information'
                : 'Create category'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CategoryDetails;
