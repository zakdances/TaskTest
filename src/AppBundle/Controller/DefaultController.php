<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;


class DefaultController extends Controller
{
    
    // public $tasks = [

    // ];
    // public $huh = 'hi there';
    /**
     * @Route("/", name="homepage")
     */
    public function indexAction(Request $request)
    {
        $huh = 'hi theree';
        $tasks = [
            (object)[
                     "label" => "task-1"
            ],
            (object)[
                "label" => "task-2"
           ]
        ];
        
        // array_push($this->tasks, (object)[
        //     "label" => "task-1"
        // ]);
        // replace this example code with whatever you need
        return $this->render('default/index.html.twig', [
            'base_dir' => realpath($this->getParameter('kernel.project_dir')).DIRECTORY_SEPARATOR,
            'huh' => $huh,
            'tasks' => $tasks
        ]);
    }

    
    public function createAction()
    {
        echo 'hi';
        return true;
    }
}
